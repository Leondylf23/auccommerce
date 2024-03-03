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
const { setTimerEventData } = require("../timers/PaymentStatus");

const paymentTimerEvents = setTimerEventData();

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

    paymentTimerEvents.emit("PaymentStatus/STOP_TASK_BY_DATA_ID", { dataId: getBidData?.id })

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
          attributes: ["bidPlacePrice", "status", "createdAt"],
          where: { status: { [not]: "PLACED" } },
        },
        {
          association: "item",
          required: true,
          attributes: ["id", "itemName"],
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
      itemId: element?.item.dataValues?.id,
      createdAt: element?.bid.dataValues?.createdAt,
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
      attributes: ["transactionCode", "paymentDatas"],
      include: [
        {
          association: "bid",
          required: true,
          attributes: ["bidPlacePrice", "status", "createdAt"],
          where: { status: { [not]: "PLACED" } },
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
        id,
      },
    });

    const paymentData = data?.dataValues?.paymentDatas;

    const remappedData = {
      ...data?.dataValues,
      transactionData: {
        itemName: paymentData?.itemData?.itemName,
        shippingData: {
          address: paymentData?.step1?.addressInformation?.address,
          reciever: paymentData?.step1?.addressInformation?.pic,
          phone: paymentData?.step1?.addressInformation?.phone,
          provider: paymentData?.step2?.providerInfo?.name,
          price: paymentData?.step2?.providerInfo?.estPrice,
          estTime: paymentData?.step2?.providerInfo?.estTime,
        },
      },
      paymentDatas: undefined,
    };

    return Promise.resolve(remappedData);
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const confirmOrderData = async (dataObject, userId) => {
  const { id } = dataObject;

  try {
    const transactionData = await db.transaction.findOne({
      attributes: ["bidId"],
      where: {
        sellerUserId: userId,
        isActive: true,
        id,
      },
    });

    const bidData = await db.bid.findOne({
      where: {
        status: "WAIT_CONFIRM",
        isActive: true,
        id: transactionData?.dataValues?.bidId,
      },
    });

    if (_.isEmpty(bidData)) throw Boom.notFound("Data is not found");

    const updateData = await bidData.update({ status: "SHIPPING" });
    if (!updateData) throw Boom.internal("Update status data failed!");

    return Promise.resolve("Data updated successfully!");
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const completeOrderData = async (dataObject, userId) => {
  const { id } = dataObject;

  try {
    const data = await db.bid.findOne({
      where: {
        userId,
        isActive: true,
        status: "SHIPPING",
        id,
      },
    });

    if (_.isEmpty(data)) throw Boom.notFound("Data is not found");

    const updateData = await data.update({ status: "COMPLETED" });
    if (!updateData) throw Boom.internal("Update status data failed!");

    return Promise.resolve("Data updated successfully!");
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

module.exports = {
  getRedirectData,
  getOrders,
  getOrderDetail,

  confirmOrderData,
  completeOrderData,
};
