const _ = require("lodash");
const Boom = require("boom");
const { lte, not } = require("sequelize/lib/operators");
require("dotenv").config({ path: `${__dirname}/../.env` });

const db = require("../../models");
const GeneralHelper = require("./generalHelper");
const {
  getKeyValue,
  deleteKeyValue,
  getKeyJSONValue,
} = require("../services/redis");
const { getPaymentRequestData } = require("../services/xendit");
const { decryptData, encryptData } = require("./utilsHelper");

// PRIVATE FUNCTIONS

// TRANSACTION HELPERS FUNCTIONS
const getRedirectData = async (dataObject) => {
  const { token } = dataObject;

  try {
    const bidData = await getKeyJSONValue(`TRANSACTION-${token}`);

    if (!bidData) throw Boom.notFound("Bid data not found!");

    const checkPayment = await getPaymentRequestData(bidData?.paymentId);

    if (checkPayment?.status !== "SUCCEEDED")
      throw Boom.badRequest("Invalid payment callback!");

    const getBidData = await db.bid.findOne({
      where: { id: bidData?.id, status: "WAIT_PAYMENT", isActive: true },
    });

    const updateBid = await getBidData.update({ status: "WAIT_CONFIRM" });
    if (!updateBid) throw Boom.internal("Error updating bid status!");

    await deleteKeyValue(`TRANSACTION-${token}`);

    return Promise.resolve({
      bidId: bidData?.id,
    });
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const getOrders = async (dataObject, userId) => {
  const { nextId } = dataObject;

  try {
    let nextIdData = null;

    try {
      nextIdData = decryptData(nextId);
    } catch (error) {
      nextIdData = null;
    }

    const data = await db.transaction.findAll({
      attributes: ["transactionCode", "id"],
      include: [
        {
          association: "bid",
          required: true,
          attributes: ["bidPlacePrice", "status"],
          where: { status: { [not]: "PLACED" } },
        },
        {
          association: "item",
          required: true,
          attributes: ["itemName"],
        },
      ],
      where: {
        sellerUserId: userId,
        isActive: true,
        ...(nextIdData && { id: { [lte]: nextIdData } }),
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
      id: element?.dataValues?.id,
      transactionCode: element?.dataValues?.transactionCode,
      itemName: element?.item.dataValues?.itemName,
      price: element?.bid.dataValues?.bidPlacePrice,
      status: element?.bid.dataValues?.status,
    }));

    return Promise.resolve({
      nextId: next ? encryptData(next) : null,
      datas: remappedData,
    });
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const getOrderDetail = async (dataObject, userId) => {
    const { id } = dataObject;
  
    try {
      const data = await db.transaction.findOne({
        attributes: ["transactionCode", "bidId", "paymentDatas"],
        include: [
          {
            association: "bid",
            required: true,
            attributes: ["bidPlacePrice", "status"],
            where: { status: { [not]: "PLACED" } },
          },
          {
            association: "item",
            required: true,
            attributes: ["itemName"],
          },
          {
            association: "user",
            required: true,
            attributes: ["fullname", "pictureUrl"],
          },
        ],
        where: {
          sellerUserId: userId,
          isActive: true,
          id
        },
      });

      const remappedData = {
        ...data?.dataValues,
        ...data?.item?.dataValues,
        ...data?.user?.dataValues,
      };
  
      return Promise.resolve(remappedData);
    } catch (err) {
      return Promise.reject(GeneralHelper.errorResponse(err));
    }
  };

module.exports = {
  getRedirectData,
  getOrders,
  getOrderDetail,
};
