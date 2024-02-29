const jwt = require("jsonwebtoken");
// eslint-disable-next-line import/no-extraneous-dependencies
const { v4: uuid } = require("uuid");
const { setKeyJSONValue, getKeyJSONValue } = require("../services/redis");
const { decryptData } = require("../helpers/utilsHelper");
// const { produce } = require("immer");
const db = require("../../models");

const AuctionHelper = require("../helpers/auctionHelper");
const AuthHelper = require("../helpers/authUserHelper");

const signatureSecretKey = process.env.SIGN_SECRET_KEY || "pgJApn9pJ8";

// SCOPE VAR
let isFirstRun = true;
const tempLiveData = [];
const joinedUser = [];
const cooldown = [];
const timer = [];
const liveRedisTTL = 2 * 60 * 60;

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
  const bidsData = await db.bid.findAll({
    attributes: ["id", "bidPlacePrice", "userId"],
    include: [
      {
        association: "user",
        required: true,
        attributes: ["fullname", ["pictureUrl", "image"]],
      },
    ],
    where: { itemId },
    order: [["bidPlacePrice", "DESC"]],
  });

  return bidsData.map((bidData) => ({
    bidId: bidData?.dataValues?.id,
    bid: bidData?.dataValues?.bidPlacePrice,
    id: bidData?.dataValues?.userId,
    image: bidData?.user?.dataValues?.image,
    fullname: bidData?.user?.dataValues?.fullname,
  }));
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
const __updateBidWinner = async (itemId) => {
  let tryCount = 5;

  const updateDataFunc = async () => {
    try {
      const winnerData = await db.bid.findOne({
        where: { itemId },
        order: [["bidPlacePrice", "DESC"]],
        limit: 1,
      });

      const updateData = await winnerData.update({ status: "WAITING" });
      if (!updateData) throw new Error("Couldn't update winner data");
    } catch (error) {
      if (tryCount > 0) {
        console.log(
          ["Error"],
          `Error updating winner data. Trying to update next 10 seconds. ${tryCount} count left.`
        );

        // eslint-disable-next-line no-plusplus
        tryCount--;

        setTimeout(() => {
          updateDataFunc();
        }, 10000);
      } else if (tryCount < 1) {
        console.log(
          ["Error"],
          "Error updating winner data. All count are used!"
        );
      }
    }
  };
  updateDataFunc();
};
const __setBidComplete = async (io, id) => {
  io.to(id).emit("auction/LIVE_ENDED");

  const findLiveDataIndx = tempLiveData.findIndex(
    (liveData) => liveData?.id === id
  );
  if (findLiveDataIndx !== -1) {
    tempLiveData[findLiveDataIndx].timerDeadline = 0;
  }
  __updateBidWinner(id);
};

// AUCOMMERCE FUNCTION
const AucommerceLiveBid = (io, socket) => {
  __resetUserLiveSession(io);

  const leave = async ({ id, token }) => {
    try {
      const user = __verifiedUser(token);

      const findUserIndex = joinedUser.findIndex(
        (dataUser) =>
          dataUser?.userId === user.userId && dataUser?.id === socket.id
      );
      if (findUserIndex !== -1) joinedUser.splice(findUserIndex, 1);

      const liveDataIndex = tempLiveData.findIndex((data) => data?.id === id);
      if (liveDataIndex === -1)
        throw new Error(`Live with id ${id} data not found for leaving!`);

      tempLiveData[liveDataIndex] = {
        ...tempLiveData[liveDataIndex],
        users: tempLiveData[liveDataIndex].users.filter(
          (userEl) => userEl?.id !== user?.userId
        ),
      };

      io.to(id).emit("auction/UPDATE_LIVE_USERS", {
        users: tempLiveData[liveDataIndex].users,
      });

      await setKeyJSONValue(
        `LIVEBID-${id}`,
        tempLiveData[liveDataIndex],
        liveRedisTTL
      );
    } catch (error) {
      console.log(["Warn"], error.message);
    }

    socket.leave(id);
  };

  const join = async ({ id, token }) => {
    try {
      const user = __verifiedUser(token);

      const getUserData = await AuthHelper.getUserProfile(user?.userId, false);
      if (getUserData?.banTimer) {
        socket.emit("auction/BANNED", { dateTimeBan: getUserData?.banTimer });
        return;
      }

      const liveDataIndex = tempLiveData.findIndex((data) => data.id === id);
      const userDataDecrypted = JSON.parse(
        decryptData(getUserData?.updateData)
      );
      const itemDetailData = await __getItemDetail(id);
      let liveUsers = [];

      if (itemDetailData.startingTimer > 0)
        throw new Error("Item is not ready to live!");

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

        const err = await setKeyJSONValue(
          `LIVEBID-${id}`,
          tempData,
          liveRedisTTL
        );
        if (err) throw err;
      } else {
        let liveData = null;

        const redisData = await getKeyJSONValue(`LIVEBID-${id}`);
        if (redisData) {
          liveData = { ...redisData, users: [newUserJoin] };
        } else {
          const dbData = await __getBidData(id);

          liveData = {
            id,
            users: [newUserJoin],
            bids: dbData,
            highestBid: itemDetailData?.startingPrice,
            timerDeadline: itemDetailData?.timeRemaining,
            topUser: dbData[0],
          };
        }

        tempLiveData.push(liveData);

        const errAddLiveData = await setKeyJSONValue(
          `LIVEBID-${id}`,
          liveData,
          liveRedisTTL
        );
        if (errAddLiveData) throw errAddLiveData;
      }

      if (itemDetailData?.timeRemaining > 0) {
        const findTimer = timer.find((timerData) => timerData?.id === id);
        if (!findTimer) {
          timer.push({
            id,
            timerId: setTimeout(() => {
              __setBidComplete(io, id);
              const findTimerIdx = timer.findIndex(
                (timerData) => timerData?.id === id
              );
              timer.splice(findTimerIdx, 1);
            }, (itemDetailData?.timeRemaining || 1) * 1000),
          });
        }
      }

      socket.join(id);
      io.to(id).emit("auction/UPDATE_LIVE_USERS", { users: liveUsers });
      socket.emit("auction/JOINED_LIVE");
    } catch (error) {
      console.log(["Error"], error.message);

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
        isLive: liveData?.timerDeadline > 0,
        topUser: liveData?.topUser,
      });
    } catch (error) {
      console.log(["Error"], error.message);

      socket.emit("auction/ERROR", { type: "GET_LIVE_DATA" });
    }
  };

  const placeBid = async ({ id, token, bid }) => {
    try {
      const setCooldown = 3;
      const findCooldownNow = cooldown.findIndex((data) => data === id);
      if (findCooldownNow !== -1) {
        socket.emit("auction/COOLDOWN", { cooldownSeconds: setCooldown });
        return;
      }

      const user = __verifiedUser(token);
      if (!(user?.role === "buyer")) throw new Error("Seller role cannot bid!");

      const liveDataIndex = tempLiveData.findIndex((data) => data.id === id);
      if (liveDataIndex === -1) throw new Error("Couldn't find data!");

      if (tempLiveData[liveDataIndex]?.timerDeadline < 1) {
        socket.emit("auction/LIVE_ENDED");
        return;
      }

      const users = tempLiveData[liveDataIndex]?.users;
      const userData = users.find((userLive) => userLive.id === user?.userId);
      if (!userData) throw new Error("Couldn't find user data!");

      if (tempLiveData[liveDataIndex].highestBid >= bid)
        throw new Error("Bid is lower than highest bid!");

      await __addBidDataInDb(user?.userId, id, bid);

      const newBidData = { ...userData, bid, bidId: uuid(), role: undefined };
      tempLiveData[liveDataIndex] = {
        ...tempLiveData[liveDataIndex],
        bids: [newBidData, ...tempLiveData[liveDataIndex].bids],
        highestBid: bid,
        topUser: { ...userData, bid, role: undefined },
      };

      cooldown.push(id);
      setTimeout(() => {
        const findCooldown = cooldown.findIndex((data) => data === id);
        if (findCooldown !== -1) cooldown.splice(findCooldown, 1);
      }, setCooldown * 1000);

      await setKeyJSONValue(
        `LIVEBID-${id}`,
        tempLiveData[liveDataIndex],
        liveRedisTTL
      );

      socket.emit("auction/PLACE_BID_SUCCESS");
      io.to(id).emit("auction/UPDATE_BID_DATA", {
        bids: tempLiveData[liveDataIndex]?.bids,
        highestBid: tempLiveData[liveDataIndex]?.highestBid,
        topUser: { ...userData, bid, role: undefined },
      });
    } catch (error) {
      console.log(["Error"], error.message);

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

// Clean up data
setInterval(() => {
  try {
    const noUserFiltered = tempLiveData
      .filter((liveData) => liveData?.users?.length < 1)
      .map((_, index) => index);

    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < noUserFiltered.length; index++) {
      const data = noUserFiltered[index];
      tempLiveData.splice(data, 1);
    }

    console.log(
      ["Info"],
      `Successfully clear data. ${noUserFiltered.length} data is/are cleared.`
    );
  } catch (error) {
    console.log(["Error"], "Error clearing data!", error);
  }
}, 30 * 60 * 1000);

module.exports = AucommerceLiveBid;
