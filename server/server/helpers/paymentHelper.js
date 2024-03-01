const _ = require("lodash");
const Boom = require("boom");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: `${__dirname}/../.env` });

const db = require("../../models");
const GeneralHelper = require("./generalHelper");
const { encryptData, decryptData } = require("./utilsHelper");
const { v4: uuid } = require("uuid");
const {
  getKeyJSONValue,
  setKeyJSONValue,
  deleteKeyJSONValue,
} = require("../services/redis");

const signatureKeyForm = process.env.PAYMENT_FORM_SIGN_KEY || "aW2gA6s3vfsA";

// PRIVATE FUNCTIONS
const __verifiedTokenData = (token) => jwt.verify(token, signatureKeyForm);

// PAYMENT HELPERS FUNCTIONS
/*
 * Flow form
 * 0. FE check if any last token info in BE, and BE check in redis using uuid
 * 0.1. If data in redis not exist, BE response it to reset persist value
 * 0.2. If data bidId in token is different from redis data, BE response it to reset persist value
 * 1. FE sending step 1 request for initial payment value
 * 1.5. If persist value still exist, use persist data to continue
 * 2. BE save initial payment value from step 1 in redis with uuid as key and
 * warp payment init info (bidId, userId, uuid, step: 1) as token, then send it to FE
 * 3. FE got response token from BE and save it in persistent storage with encrypted value
 * 4. FE send step 2 and so on information with token and BE validate token data and
 * BE compare token values (userId and bidId) with redis data (get it from uuid in token)
 * 5. BE save next step data and warp new token data
 * 6. If FE reaches end of step, check token step data and get form data from redis
 * to process the form
 * 7. If success, delete form data in redis
 *
 * NOTE: If persist data still exists and redis still exists, then all step can
 * continue use old token and encrypted data to process last step
 */

const checkPaymentFormInitInfo = async (dataObject, userId) => {
  const { token, bidId } = dataObject;

  try {
    let tokenData = null;

    try {
      tokenData = __verifiedTokenData(token);
    } catch (error) {
      throw Boom.badData("Token is malformed!");
    }

    if (!tokenData) throw Boom.badRequest("Invalid token data!");

    const redisData = await getKeyJSONValue(`PAYMENT-DATA-${tokenData}`);

    if (!redisData)
      throw Boom.badRequest(
        "This token is not available to continue the form."
      );
    if (redisData?.userId !== userId || redisData?.bidId !== bidId)
      throw Boom.badRequest("This data is different from redis data!");

    return Promise.resolve({
      nextStep: redisData?.nextStep,
    });
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const getFormData = async (dataObject, userId) => {
  const { token, step, bidId } = dataObject;

  try {
    let tokenData = null;

    try {
      tokenData = __verifiedTokenData(token);
    } catch (error) {
      throw Boom.badData("Token is malformed!");
    }

    if (!tokenData) throw Boom.badRequest("Invalid token data!");

    const redisData = await getKeyJSONValue(
      `PAYMENT-DATA-${tokenData?.formId}`
    );

    if (!redisData)
      throw Boom.badRequest(
        "This token is not available to continue the form."
      );
    if (
      redisData?.nextStep < step ||
      redisData?.userId !== userId ||
      redisData?.bidId !== bidId
    )
      throw Boom.badRequest("This token data is different from redis data!");

    const encryptedData = redisData?.[`step${step}`]
      ? encryptData(JSON.stringify(redisData?.[`step${step}`]))
      : null;

    return Promise.resolve({
      nextStep: redisData?.nextStep,
      formData: encryptedData,
    });
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const appendNewFormData = async (dataObject, userId) => {
  const { data } = dataObject;

  try {
    const getEncryptedData = decryptData(data);
    const formData = JSON.stringify(getEncryptedData);

    const newFormData = {
      nextStep: 2,
      userId,
      bidId: formData?.bidId,
      step1: formData?.data,
    };

    const formId = uuid();
    const tokenData = formId;

    const errRedis = setKeyJSONValue(
      `PAYMENT-DATA-${formId}`,
      newFormData,
      1 * 24 * 60 * 60
    );
    if (errRedis) throw Boom.internal("Redis error set key value");

    const token = jwt.sign(tokenData, signatureKeyForm);

    return Promise.resolve({
      nextStep: 2,
      token,
    });
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const appendFormData = async (dataObject, userId) => {
  const { data, token } = dataObject;

  try {
    let formId = null;
    try {
      formId = __verifiedTokenData(token);
    } catch (error) {
      throw Boom.badRequest("Token data is not valid");
    }

    const getEncryptedData = decryptData(data);
    const formData = JSON.stringify(getEncryptedData);

    const redisData = await getKeyJSONValue(`PAYMENT-DATA-${formId}`);

    if (redisData) throw Boom.notFound("Data in redis is not found!");

    if (
      redisData.nextStep < formData?.step ||
      redisData?.userId !== userId ||
      redisData?.bidId !== formData?.bidId
    )
      throw Boom.badRequest("Data is not consistent!");

    const updateFormData = {
      ...redisData,
      [`step${formData?.step}`]: formData?.data,
    };

    const errRedis = setKeyJSONValue(
      `PAYMENT-DATA-${formId}`,
      updateFormData,
      1 * 24 * 60 * 60
    );
    if (errRedis) throw Boom.internal("Redis error set key value");

    return Promise.resolve({
      nextStep: (formData?.step || 0) + 1,
    });
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const completeFormData = async (dataObject, userId) => {
  const { token } = dataObject;

  try {
    let formId = null;
    try {
      formId = __verifiedTokenData(token);
    } catch (error) {
      throw Boom.badRequest("Token data is not valid");
    }

    const redisData = await getKeyJSONValue(`PAYMENT-DATA-${formId}`);

    if (redisData) throw Boom.notFound("Data in redis is not found!");

    if (redisData.nextStep === 5 || redisData?.userId !== userId)
      throw Boom.badRequest("Data is not consistent!");

    // TODO: add payment

    const resultTransaction = await db.sequelize.transaction(async () => {
      const createPayment = await db.transaction.create({});
      if (!createPayment) throw Boom.internal("Create payment failed!");

      const bidData = await db.bid.findOne({
        id: redisData?.bidId,
        isActive: true,
        status: "WAITING",
      });

      if (_.isEmpty(bidData)) throw Boom.internal("Bid data is not found!");

      const updateBidData = await bidData.update({ status: "WAIT_PAYMENT" });
      if (!updateBidData) throw Boom.internal("Bid data is not updated!");

      const errDelRedis = await deleteKeyJSONValue(`PAYMENT-DATA-${formId}`);
      if (errDelRedis) throw Boom.internal("Delete form date!");

      return createPayment?.id;
    });

    if (!resultTransaction)
      throw Boom.internal("Transaction data is not created!");
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

module.exports = {
  checkPaymentFormInitInfo,
  getFormData,

  appendNewFormData,
  appendFormData,
  completeFormData,
};
