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

const __getUserJoinedData = (id) => {
  const findJoinedUsers = joinedUser.findIndex(
    (joinData) => joinData?.id === id
  );
  if (findJoinedUsers !== -1)
    return { userData: joinedUser[findJoinedUsers], index: findJoinedUsers };
};

const __getLiveData = (id) => {
  const liveDataIndex = tempLiveData.findIndex((data) => data?.id === id);
  if (liveDataIndex !== -1)
    return { liveData: tempLiveData[liveDataIndex], index: liveDataIndex };
};

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

  const leave = async () => {
    try {
      const getUserData = __getUserJoinedData(
        socket?.id
      );
      if (!getUserData) {
        console.log(
          ["Warn"],
          `Joined data not found from socket id ${socket?.id}!`
        );
        return;
      }
      const userData = getUserData?.userData;
      const userDataIndex = getUserData?.index;
      const joinedItemId = userData?.itemId;
      
      joinedUser.splice(userDataIndex, 1);

      const getLiveData = __getLiveData(joinedItemId);
      if (!getLiveData) {
        console.log(
          ["Warn"],
          `Live with id ${joinedItemId} data not found for leaving from socket id ${socket?.id}!`
        );
        return;
      }

      const liveDataIndex = getLiveData?.index;
      tempLiveData[liveDataIndex] = {
        ...tempLiveData[liveDataIndex],
        users: tempLiveData[liveDataIndex].users.filter(
          (userEl) => userEl?.socketId !== socket?.id
        ),
      };

      io.to(joinedItemId).emit("auction/UPDATE_LIVE_USERS", {
        users: tempLiveData[liveDataIndex]?.users?.map((userDisp) => ({
          image: userDisp?.image,
          fullname: userDisp?.fullname,
        })),
      });

      socket.leave(joinedItemId);

      await setKeyJSONValue(
        `LIVEBID-${joinedItemId}`,
        tempLiveData[liveDataIndex],
        liveRedisTTL
      );
    } catch (error) {
      console.log(["Error"], error.message);
    }
  };

  const join = async ({ id, token }) => {
    try {
      const user = __verifiedUser(token);

      const getUserDataDb = await AuthHelper.getUserProfile(
        user?.userId,
        false
      );
      const userDataDecrypted = JSON.parse(
        decryptData(getUserDataDb?.updateData)
      );
      if (getUserDataDb?.banTimer) {
        socket.emit("auction/BANNED", { dateTimeBan: getUserDataDb?.banTimer });
        return;
      }

      const itemDetailData = await __getItemDetail(id);
      if (itemDetailData.startingTimer > 0)
        throw new Error("Item is not ready to live!");

      joinedUser.push({
        id: socket?.id,
        userId: user?.userId,
        role: userDataDecrypted?.role,
        image: userDataDecrypted?.profileImage,
        fullname: userDataDecrypted?.fullname,
        itemId: id,
      });

      const findExistingUser = joinedUser?.findIndex(
        (joinedUserData) =>
          joinedUserData?.userId === user?.userId &&
          joinedUserData?.id !== socket?.id
      );
      if (findExistingUser !== -1) {
        io.to(joinedUser[findExistingUser]?.id).emit("auction/KICK_USER");
      }

      const newUserJoin = {
        id: user?.userId,
        socketId: socket?.id,
        image: userDataDecrypted?.profileImage,
        fullname: userDataDecrypted?.fullname,
      };

      const getLiveData = __getLiveData(id);
      if (getLiveData) {
        // Data is fetched before
        const liveData = getLiveData?.liveData;
        const liveDataIndex = getLiveData?.index;

        const liveUsersData = liveData?.users;

        tempLiveData[liveDataIndex].users = [...liveUsersData, newUserJoin];

        const err = await setKeyJSONValue(
          `LIVEBID-${id}`,
          tempLiveData[liveDataIndex],
          liveRedisTTL
        );
        if (err) throw err;

        io.to(id).emit("auction/UPDATE_LIVE_USERS", {
          users: tempLiveData[liveDataIndex]?.users?.map((userDisp) => ({
            image: userDisp?.image,
            fullname: userDisp?.fullname,
          })),
        });
      } else {
        // Data is first time fetched
        let newLiveData = null;

        const redisData = await getKeyJSONValue(`LIVEBID-${id}`);
        if (redisData) {
          newLiveData = { ...redisData, users: [newUserJoin] };
        } else {
          const dbData = await __getBidData(id);

          newLiveData = {
            id,
            users: [newUserJoin],
            bids: dbData,
            highestBid: dbData[0]
              ? dbData[0]?.bid
              : itemDetailData?.startingPrice,
            timerDeadline: itemDetailData?.timeRemaining,
            topUser: dbData[0],
          };
        }

        tempLiveData.push(newLiveData);

        const errAddLiveData = await setKeyJSONValue(
          `LIVEBID-${id}`,
          newLiveData,
          liveRedisTTL
        );
        if (errAddLiveData) throw errAddLiveData;

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
      }

      socket.join(id);
      socket.emit("auction/JOINED_LIVE");
    } catch (error) {
      console.log(["Error"], error.message);

      socket.emit("auction/ERROR", {
        type: "JOIN_LIVE",
        message: error.message,
      });
    }
  };

  const getLiveDataClient = async () => {
    try {
      const user = __getUserJoinedData(socket?.id);
      if (!user)
        throw new Error(`Joined data not found from socket id ${socket?.id}!`);
      const userData = user?.userData;

      const getLiveData = __getLiveData(userData?.itemId);
      if (!getLiveData?.liveData) throw new Error("Couldn't find live data!");

      const liveData = getLiveData?.liveData;
      socket.emit("auction/SET_LIVE_DATA", {
        users: liveData?.users,
        bids: liveData?.bids,
        highestBid: liveData?.highestBid,
        userId: userData?.userId,
        isAbleBid: userData?.role === "buyer",
        isLive: liveData?.timerDeadline > 0,
        topUser: liveData?.topUser,
      });
    } catch (error) {
      console.log(["Error"], error.message);

      socket.emit("auction/ERROR", { type: "GET_LIVE_DATA" });
    }
  };

  const placeBid = async ({ bid }) => {
    try {
      // Race condition & spam handler
      const setCooldown = 3;

      const getUserData = __getUserJoinedData(socket?.id);
      if (!getUserData)
        throw new Error(`Joined data not found from socket id ${socket?.id}!`);

      const userData = getUserData?.userData;
      const userJoinItemId = userData?.itemId;

      if (userData?.role !== "buyer")
        throw new Error("Seller role cannot bid!");

      const findCooldownNow = cooldown.findIndex(
        (data) => data === userJoinItemId
      );
      if (findCooldownNow !== -1) {
        socket.emit("auction/COOLDOWN", { cooldownSeconds: setCooldown });
        return;
      }
      cooldown.push(userJoinItemId);

      setTimeout(() => {
        const findCooldown = cooldown.findIndex(
          (data) => data === userJoinItemId
        );
        if (findCooldown !== -1) cooldown.splice(findCooldown, 1);
      }, setCooldown * 1000);

      const getLiveData = __getLiveData(userJoinItemId);
      if (!getLiveData)
        throw new Error(`Couldn't find data from item id ${userJoinItemId}!`);
      const liveData = getLiveData?.liveData;

      if (liveData?.timerDeadline < 1) {
        socket.emit("auction/LIVE_ENDED");
        return;
      }

      if (liveData.highestBid >= bid)
        throw new Error("Bid is lower than highest bid!");

      await __addBidDataInDb(userData?.userId, userJoinItemId, bid);

      
      const newBidData = {
        id: userData?.userId,
        image: userData?.image,
        fullname: userData?.fullname,
        bid,
        bidId: uuid()
      };

      const liveDataIndex = getLiveData?.index;
      tempLiveData[liveDataIndex] = {
        ...tempLiveData[liveDataIndex],
        bids: [newBidData, ...tempLiveData[liveDataIndex].bids],
        highestBid: bid,
        topUser: newBidData,
      };

      await setKeyJSONValue(
        `LIVEBID-${userJoinItemId}`,
        tempLiveData[liveDataIndex],
        liveRedisTTL
      );

      socket.emit("auction/PLACE_BID_SUCCESS");
      io.to(userJoinItemId).emit("auction/UPDATE_BID_DATA", {
        bids: tempLiveData[liveDataIndex]?.bids,
        highestBid: tempLiveData[liveDataIndex]?.highestBid,
        topUser: newBidData,
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
  socket.on("auction/GET_LIVE_DATA", getLiveDataClient);
  socket.on("auction/PLACE_BID", placeBid);
  socket.on("auction/LEAVE_LIVE", leave);

  socket.on("disconnect", () => {
    console.log(["info"], `Socket id ${socket?.id} is disconnected`);

    leave();
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
