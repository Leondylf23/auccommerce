const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");
const { setKeyJSONValue } = require("../services/redis");
const { decryptData } = require("../helpers/utilsHelper");
const { produce } = require("immer");

const signatureSecretKey = process.env.SIGN_SECRET_KEY || "pgJApn9pJ8";

// SCOPE VAR
const tempLiveData = [];

// PRIVATE FUNCTION
const __verifiedUser = (token) => jwt.verify(token, signatureSecretKey);

const AucommerceLiveBid = (io, socket) => {
  const join = async ({ id, token, userData }) => {
    try {
      const user = __verifiedUser(token);

      const liveDataIndex = tempLiveData.findIndex((data) => data.id === id);
      const userDataDecrypted = JSON.parse(decryptData(userData));
      let liveUsers = [];

      if (liveDataIndex !== -1) {
        const tempData = tempLiveData[liveDataIndex];

        tempData.users = [
          ...tempData.users,
          {
            id: user?.userId,
            image: userDataDecrypted?.profileImage,
            role: userDataDecrypted?.profileImage,
            fullname: userDataDecrypted?.fullname,
          },
        ];
        liveUsers = tempData.users;

        const err = await setKeyJSONValue(`LIVEBID-${id}`, tempData);
        if (err) throw err;
      } else {
        const newData = {
          id,
          users: [
            {
              id: user?.userId,
              image: userDataDecrypted?.profileImage,
              role: userDataDecrypted?.profileImage,
              fullname: userDataDecrypted?.fullname,
            },
          ],
          bids: [],
        };

        tempLiveData.push(newData);

        const err = await setKeyJSONValue(`LIVEBID-${id}`, newData);
        if (err) throw err;
      }

      socket.join(id);
      io.to(id).emit("auction/UPDATE_LIVE_USERS", { users: liveUsers });
      socket.emit("auction/JOINED_LIVE");
    } catch (error) {
      console.log(error);

      socket.emit("auction/ERROR", {
        type: "JOIN_LIVE",
        message: error.message,
      });
    }
  };

  const leave = ({ id, token }) => {
    try {
      const user = __verifiedUser(token);

      const liveDataIndex = tempLiveData.findIndex((data) => data?.id === id);

      if (liveDataIndex !== -1) {
        tempLiveData[liveDataIndex] = {
          ...tempLiveData[liveDataIndex],
          users: tempLiveData[liveDataIndex].users.filter(
            (userEl) => userEl?.id !== user?.userId
          ),
        };

        io.to(id).emit("auction/UPDATE_LIVE_USERS", {
          users: tempLiveData[liveDataIndex].users,
        });
      } else {
        throw new Error("Live data not found for leaving!");
      }
    } catch (error) {
      console.log(error);

      socket.emit("auction/ERROR", {
        type: "LEAVE_LIVE",
        message: error.message,
      });
    }

    socket.leave(id);
  };

  const getLiveData = async ({ id }) => {
    try {
      const liveData = tempLiveData.find((data) => data.id === id);

      if (!liveData) throw new Error("Could't find live data!");

      socket.emit("auction/SET_LIVE_DATA", {
        users: liveData?.users,
        bids: liveData?.bids,
      });
    } catch (error) {
      console.log(error.message);

      socket.emit("auction/ERROR", { type: "GET_LIVE_DATA" });
    }
  };

  const placeBid = async ({ id, token, bid }) => {
    try {
      const user = __verifiedUser(token);

      const liveDataIndex = tempLiveData.findIndex((data) => data.id === id);
      if (liveDataIndex === -1) throw new Error("Couldn't find data!");

      tempLiveData[liveDataIndex] = {
        ...tempLiveData[liveDataIndex],
        bids: [
          ...tempLiveData[liveDataIndex].bids,
          { userId: user?.userId, bid },
        ],
      };

      socket.emit("auction/PLACE_BID_SUCCESS");
    } catch (error) {
      console.log(error.message);

      socket.emit("auction/ERROR", { type: "PLACE_BID" });
    }
  };

  // DEFINE EVENTS
  socket.on("auction/JOIN_LIVE", join);
  socket.on("auction/GET_LIVE_DATA", getLiveData);
  socket.on("auction/PLACE_BID", placeBid);
  socket.on("auction/LEAVE_LIVE", leave);

  socket.on("disconnect", () => {
    console.log(["info"], `Socket id ${socket?.id} is disconnected`);
  });
};

module.exports = AucommerceLiveBid;
