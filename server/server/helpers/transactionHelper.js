const _ = require("lodash");
const Boom = require("boom");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: `${__dirname}/../.env` });

const db = require("../../models");
const GeneralHelper = require("./generalHelper");
const {
  getKeyValue,
  deleteKeyValue,
  getKeyJSONValue,
} = require("../services/redis");
const { getPaymentRequestData } = require("../services/xendit");

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

module.exports = {
  getRedirectData,
};
