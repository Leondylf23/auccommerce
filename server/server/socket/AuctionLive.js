const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");
const { setKeyJSONValue, getKeyJSONValue } = require("../services/redis");
const { decryptData } = require("../helpers/utilsHelper");
// const { produce } = require("immer");
const db = require("../../models");

const AuctionHelper = require("../helpers/auctionHelper");

const signatureSecretKey = process.env.SIGN_SECRET_KEY || "pgJApn9pJ8";

// SCOPE VAR
let isFirstRun = true;
const tempLiveData = [];
const joinedUser = [];

// PRIVATE FUNCTION
const __verifiedUser = (token) => jwt.verify(token, signatureSecretKey);
const __getItemDetail = async (id) => AuctionHelper.getAuctionDetail({ id });
const __resetUserLiveSession = async (io) => {
  if (isFirstRun) {
    io.emit("auction/KICK_USER");
    isFirstRun = false;
  }
};
const __getBidData = async (itemId) => {
  await db.sequelize.transaction(async () => {
    const createdBid = await db.bid.fetchAll({
      attributes: ["bidPlacePrice"],
      includes: [
        {
          association: "user",
          required: true,
          attributes: ["fullname", ["pictureUrl", "image"]],
        },
      ],
      where: { id: itemId },
      
    });

    if (!createdBid?.id) throw new Error("Bid data was not created!");
  });
};
const __addBidDataInDb = async (userId, itemId, bidPlacePrice) => {
  await db.sequelize.transaction(async () => {
    const createdBid = await db.bid.create({
      userId,
      itemId,
      bidPlacePrice,
      status: "PLACED",
    });

    if (!createdBid?.id) throw new Error("Bid data was not created!");
  });
};

// AUCOMMERCE FUNCTION
const AucommerceLiveBid = (io, socket) => {
  __resetUserLiveSession(io);

  const leave = async ({ id, token }) => {
    try {
      const user = __verifiedUser(token);

      const findUserIndex = joinedUser.findIndex(
        (dataUser) => dataUser?.userId === user.userId
      );
      joinedUser.splice(findUserIndex, 1);

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

        await setKeyJSONValue(`LIVEBID-${id}`, tempLiveData[liveDataIndex]);
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

  const join = async ({ id, token, userData }) => {
    try {
      const user = __verifiedUser(token);

      const liveDataIndex = tempLiveData.findIndex((data) => data.id === id);
      const userDataDecrypted = JSON.parse(decryptData(userData));
      const itemDetailData = await __getItemDetail(id);
      let liveUsers = [];

      const findUserIndex = joinedUser.findIndex(
        (dataUser) => dataUser?.userId === user.userId
      );
      if (findUserIndex !== -1) {
        io.to(joinedUser[findUserIndex]?.id).emit("auction/KICK_USER");
        await leave({ id, token });
      }

      joinedUser.push({
        id: socket?.id,
        userId: user?.userId,
        itemId: id,
        token,
      });

      const newUserJoin = {
        id: user?.userId,
        image: userDataDecrypted?.profileImage,
        role: userDataDecrypted?.role,
        fullname: userDataDecrypted?.fullname,
      };

      if (liveDataIndex !== -1) {
        const tempData = tempLiveData[liveDataIndex];

        tempData.users = [...tempData.users, newUserJoin];
        liveUsers = tempData.users;

        const err = await setKeyJSONValue(`LIVEBID-${id}`, tempData);
        if (err) throw err;
      } else {
        let liveData = null;

        const redisData = await getKeyJSONValue(`LIVEBID-${id}`);
        if (redisData) {
          liveData = { ...redisData, users: [newUserJoin] };
        } else {
          liveData = {
            id,
            users: [newUserJoin],
            bids: [],
            highestBid: itemDetailData?.startingPrice,
          };
        }

        tempLiveData.push(liveData);

        const errAddLiveData = await setKeyJSONValue(`LIVEBID-${id}`, liveData);
        if (errAddLiveData) throw errAddLiveData;
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

  const getLiveData = async ({ id, token }) => {
    try {
      const user = __verifiedUser(token);
      const liveData = tempLiveData.find((data) => data.id === id);

      if (!liveData) throw new Error("Couldn't find live data!");

      socket.emit("auction/SET_LIVE_DATA", {
        users: liveData?.users,
        bids: liveData?.bids,
        highestBid: liveData?.highestBid,
        userId: user?.userId,
        isAbleBid: user?.role === "buyer",
      });
    } catch (error) {
      console.log(error.message);

      socket.emit("auction/ERROR", { type: "GET_LIVE_DATA" });
    }
  };

  const placeBid = async ({ id, token, bid }) => {
    try {
      const user = __verifiedUser(token);
      if (!(user?.role === "buyer")) throw new Error("Seller role cannot bid!");

      const liveDataIndex = tempLiveData.findIndex((data) => data.id === id);
      if (liveDataIndex === -1) throw new Error("Couldn't find data!");

      const users = tempLiveData[liveDataIndex]?.users;
      const userData = users.find((userLive) => userLive.id === user?.userId);
      if (!userData) throw new Error("Couldn't find user data!");
      if (tempLiveData[liveDataIndex].highestBid >= bid)
        throw new Error("Bid is lower than highest bid!");

      const newBidData = { ...userData, bid, bidId: uuid() };
      tempLiveData[liveDataIndex] = {
        ...tempLiveData[liveDataIndex],
        bids: [newBidData, ...tempLiveData[liveDataIndex].bids],
        highestBid: bid,
      };

      await __addBidDataInDb(user?.userId, id, bid);
      await setKeyJSONValue(`LIVEBID-${id}`, tempLiveData[liveDataIndex]);

      socket.emit("auction/PLACE_BID_SUCCESS");
      io.to(id).emit("auction/UPDATE_BID_DATA", {
        bids: tempLiveData[liveDataIndex]?.bids,
        highestBid: tempLiveData[liveDataIndex]?.highestBid,
      });
    } catch (error) {
      console.log(error.message);

      socket.emit("auction/ERROR", {
        type: "PLACE_BID",
        message: error.message,
      });
    }
  };

  // DEFINE EVENTS
  socket.on("auction/JOIN_LIVE", join);
  socket.on("auction/GET_LIVE_DATA", getLiveData);
  socket.on("auction/PLACE_BID", placeBid);
  socket.on("auction/LEAVE_LIVE", leave);

  socket.on("disconnect", () => {
    console.log(["info"], `Socket id ${socket?.id} is disconnected`);

    const findUser = joinedUser.find((user) => user.id === socket.id);
    if (findUser) {
      leave({ id: findUser?.itemId, token: findUser?.token });
    }
  });
};

module.exports = AucommerceLiveBid;
