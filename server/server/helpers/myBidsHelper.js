const _ = require("lodash");
const Boom = require("boom");
const { lte, not } = require("sequelize/lib/operators");

const db = require("../../models");
const GeneralHelper = require("./generalHelper");
const { decryptData, encryptData } = require("./utilsHelper");

// PRIVATE FUNCTIONS
const __formatDateNonISO = (date) =>
  new Date(date).toISOString().replace("T", " ").slice(0, 19);

// AUCTION HELPERS FUNCTIONS
const getMyBidsData = async (dataObject, userId) => {
  const { nextId, filter } = dataObject;

  try {
    let nextIdData = null;

    try {
      nextIdData = decryptData(nextId);
    } catch (error) {
      nextIdData = null;
    }

    const data = await db.bid.findAll({
      attributes: ["id", ["bidPlacePrice", "price"], "createdAt", "status"],
      include: [
        {
          association: "item",
          required: true,
          attributes: ["itemName", "itemPictures"],
        },
      ],
      where: {
        userId,
        isActive: true,
        ...(nextIdData && { id: { [lte]: nextIdData } }),
        ...(filter === "successful" && { status: { [not]: "PLACED" } }),
      },
      order: [["id", "DESC"]],
      limit: 10,
    });

    let next = null;
    if (data?.length > 9) {
      next = data[9]?.dataValues?.id.toString();
      data.pop();
    }

    const remappedData = data?.map((element) => ({
      ...element?.dataValues,
      itemName: element?.item.dataValues?.itemName,
      itemImage: element?.item.dataValues?.itemPictures[0],
      items: undefined,
      itemPictures: undefined,
    }));

    return Promise.resolve({
      nextId: next ? encryptData(next) : null,
      datas: remappedData,
    });
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const getMyBidDetailData = async (dataObject, userId) => {
  const { id } = dataObject;

  try {
    const data = await db.bid.findOne({
      attributes: [
        ["bidPlacePrice", "price"],
        "createdAt",
        "status",
        [
          db.sequelize.literal(
            `(SELECT JSON_OBJECT('price', hgBids.bidPlacePrice, 'userId', hgBids.userid) FROM bids AS hgBids WHERE hgBids.itemId = bid.itemId ORDER BY bidPlacePrice DESC LIMIT 1)`
          ),
          "highestBid",
        ],
      ],
      include: [
        {
          association: "item",
          required: true,
          attributes: [
            ["id", "itemId"],
            "itemName",
            ["itemPictures", "itemImages"],
            "itemDescription",
            ["itemStartBidPrice", "startingPrice"],
            "status",
          ],
        },

        {
          association: "transactions",
          required: false,
          attributes: ["paymentDeadline"],
        },
      ],
      where: {
        userId,
        isActive: true,
        id,
      },
      order: [["id", "DESC"]],
      limit: 10,
    });

    const deadlineDate = new Date(data?.dataValues?.createdAt);
    deadlineDate.setHours(
      deadlineDate.getHours() + (24 + 7),
      deadlineDate.getMinutes(),
      deadlineDate.getSeconds()
    );
    const deadlineDateISO = deadlineDate.toISOString();

    return Promise.resolve({
      ...data?.dataValues,
      ...data?.item?.dataValues,
      ...data?.transaction?.dataValues,
      status: data?.dataValues?.status,
      bidDeadline: deadlineDateISO,
      highestBid: data?.dataValues?.highestBid?.price,
      isWinner: data?.dataValues?.status !== "PLACED",
      transactionData: {
        payUntil: "2024-03-01 00:00:00",
        transactionId: 1,
      },
      isLiveNow: data?.item?.dataValues?.status === "LIVE",
      item: undefined,
      transactions: undefined,
    });
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

module.exports = {
  getMyBidsData,
  getMyBidDetailData,
};
