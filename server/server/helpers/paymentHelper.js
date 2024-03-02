const _ = require("lodash");
const Boom = require("boom");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: `${__dirname}/../.env` });

const db = require("../../models");
const GeneralHelper = require("./generalHelper");
const {
  encryptData,
  decryptData,
  generateRandomString,
} = require("./utilsHelper");
const { v4: uuid } = require("uuid");
const {
  getKeyJSONValue,
  setKeyJSONValue,
  deleteKeyJSONValue,
  setKeyValue,
} = require("../services/redis");
const {
  requestPaymentXendit,
  getPaymentMethodsData,
} = require("../services/xendit");

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
 * warp payment init info (bidId, userId, uuid, ...) as token, then send it to FE
 * 3. FE got response token from BE and save it in persistent storage with encrypted value
 * 4. FE send step 2 and so on information with token and BE validate token data and
 * BE compare token values (userId and bidId) with redis data (get it from uuid in token)
 * 5. BE save next step data
 * 6. If FE reaches end of step, check token step data and get form data from redis
 * to process the form
 * 7. If success, delete form data in redis
 *
 * NOTE: If persist data still exists and redis still exists, then all step can
 * continue use old token to process last step
 */

const checkPaymentFormInitInfo = async (dataObject, userId) => {
  const { token, bidId } = dataObject;

  try {
    let tokenData = null;

    try {
      tokenData = __verifiedTokenData(token);
    } catch (error) {
      throw Boom.badRequest("Token is malformed!");
    }

    const bidDbData = await db.bid.findOne({
      attributes: ["id"],
      where: { id: bidId, isActive: true, status: "WAITING" },
    });
    if (_.isEmpty(bidDbData)) throw Boom.badRequest("This bid data is empty.");

    if (!tokenData) throw Boom.badRequest("Invalid token data!");

    const redisData = await getKeyJSONValue(`PAYMENT-DATA-${tokenData}`);

    if (!redisData)
      throw Boom.badRequest(
        "This token is not available to continue the form."
      );
    if (redisData?.userId !== userId || redisData?.bidId !== bidId)
      throw Boom.badRequest("This data is different from redis data!");

    // eslint-disable-next-line no-restricted-globals
    if (!redisData?.bidPrice || isNaN(redisData?.bidPrice))
      throw Boom.badRequest("Bid price is invalid!");

    return Promise.resolve({
      nextStep: (redisData?.latestStep || 0) + 1,
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

    const redisData = await getKeyJSONValue(`PAYMENT-DATA-${tokenData}`);

    if (!redisData)
      throw Boom.badRequest(
        "This token is not available to continue the form."
      );
    if (
      redisData?.latestStep < step ||
      redisData?.userId !== userId ||
      redisData?.bidId !== bidId
    )
      throw Boom.badRequest("This token data is different from redis data!");

    const stepData = redisData?.[`step${step}`];
    const encryptedData = stepData
      ? encryptData(JSON.stringify(stepData))
      : null;

    return Promise.resolve({
      nextStep: redisData?.nextStep,
      formData: encryptedData,
    });
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const getShipProvidersData = async (dataObject, userId) => {
  const { token } = dataObject;

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

    if (redisData?.userId !== userId)
      throw Boom.badRequest("This data user is different from redis data!");

    const addressId = redisData?.step1?.selectedAddressId;

    const addressDataDb = await db.address.findOne({
      where: { id: addressId, userId, isActive: true },
    });
    if (_.isEmpty(addressDataDb)) throw Boom.internal("Address data is empty!");

    const userAddress = addressDataDb?.dataValues?.address;

    const exampleData = [
      {
        id: 1,
        name: "JNE",
        address: "rumah",
        estTime: "2024-03-05",
        estPrice: 9000,
      },
      {
        id: 2,
        name: "JNT",
        address: "rumah",
        estTime: "2024-03-04",
        estPrice: 12000,
      },
      {
        id: 3,
        name: "Ninja Express",
        address: "rumah",
        estTime: "2024-03-03",
        estPrice: 14000,
      },
      {
        id: 4,
        name: "Anterin Aja",
        address: "rumah",
        estTime: "2024-03-04",
        estPrice: 11000,
      },
    ];

    const mappedData = exampleData?.map((provider) => ({
      ...provider,
      address: userAddress,
    }));

    const encryptedData = encryptData(JSON.stringify(mappedData));

    return Promise.resolve({
      providers: encryptedData,
    });
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const getPaymentMethods = async (dataObject, userId) => {
  const { token } = dataObject;

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

    if (redisData?.userId !== userId)
      throw Boom.badRequest("This data user is different from redis data!");

    const paymentMethods = getPaymentMethodsData().map((method) => ({
      id: method?.id,
      name: method?.methodName,
      logo: method?.logo,
    }));

    return Promise.resolve(paymentMethods);
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const getSummaryData = async (dataObject, userId) => {
  const { token } = dataObject;

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

    if (redisData?.userId !== userId)
      throw Boom.badRequest("This data user is different from redis data!");

    if (
      // eslint-disable-next-line no-restricted-globals
      isNaN(redisData?.bidPrice) ||
      // eslint-disable-next-line no-restricted-globals
      isNaN(redisData?.step2?.providerInfo?.estPrice)
    )
      throw Boom.badData("Some price data are invalid!");

    const adminPrice = 10000;
    const totalPrice =
      parseFloat(redisData?.bidPrice || 0) +
      parseFloat(redisData?.step2?.providerInfo?.estPrice || 0) +
      adminPrice;

    const mappedData = {
      itemData: {
        ...redisData?.itemData,
      },
      bidPrice: parseFloat(redisData?.bidPrice),
      shipingDataPrice: redisData?.step2?.providerInfo?.estPrice,
      adminPrice,
      totalPrice,
      paymentMethod: {
        ...redisData?.step3?.paymentMethodInfo,
      },
    };

    const encryptedData = encryptData(JSON.stringify(mappedData));

    return Promise.resolve({
      formData: encryptedData,
    });
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const appendFormData = async (dataObject, userId) => {
  const { data, token } = dataObject;

  try {
    let formId = null;
    let newToken = null;

    if (token) {
      try {
        formId = __verifiedTokenData(token);
      } catch (error) {
        throw Boom.badRequest("Token data is not valid");
      }
    }
    const getEncryptedData = decryptData(data);
    const formData = JSON.parse(getEncryptedData);

    let redisData = null;
    let latestStep = 0;
    let newFormData = null;

    // eslint-disable-next-line no-restricted-globals
    if (isNaN(formData?.step) || formData?.step < 1 || formData?.step > 3)
      throw Boom.badRequest("Invalid form step!");

    if (formId) {
      redisData = await getKeyJSONValue(`PAYMENT-DATA-${formId}`);
      if (!redisData) throw Boom.notFound("Data in redis is not found!");

      if (
        redisData.latestStep < (formData?.step || 10) - 1 ||
        redisData?.userId !== userId ||
        redisData?.bidId !== formData?.bidId
      )
        throw Boom.badRequest("Data is not consistent!");

      latestStep =
        redisData?.latestStep < formData?.step
          ? formData?.step
          : redisData?.latestStep;

      if (formData?.step === 1 && redisData?.step2 && redisData?.step3) {
        redisData.step2 = undefined;
        redisData.step3 = undefined;
        latestStep = 1;
      }
      if (formData?.step === 2 && redisData?.step3) {
        redisData.step3 = undefined;
        latestStep = 2;
      }
    } else {
      const checkStep = formData?.step;
      if (checkStep !== 1)
        throw Boom.badRequest("New form must be start at step 1!");

      // eslint-disable-next-line no-restricted-globals
      if (!formData?.bidId || isNaN(formData?.bidId))
        throw Boom.badRequest("Must append valid bid id!");

      const bidDbData = await db.bid.findOne({
        attributes: ["bidPlacePrice"],
        include: [
          {
            association: "item",
            required: true,
            attributes: ["itemName", "itemPictures"],
          },
        ],
        where: { id: formData?.bidId, isActive: true, status: "WAITING" },
      });
      if (_.isEmpty(bidDbData))
        throw Boom.badRequest("This bid data is empty.");

      formId = uuid();
      newToken = jwt.sign(formId, signatureKeyForm);

      newFormData = {
        userId,
        bidId: formData?.bidId,
        bidPrice: bidDbData?.dataValues?.bidPlacePrice,
        itemData: {
          itemName: bidDbData?.item?.dataValues?.itemName,
          image: bidDbData?.item?.dataValues?.itemPictures[0],
        },
      };

      latestStep = 1;
    }

    const appendFormDataRedis = {
      ...(newFormData || redisData),
      latestStep,
      [`step${formData?.step}`]: formData?.data,
    };

    const errRedis = await setKeyJSONValue(
      `PAYMENT-DATA-${formId}`,
      appendFormDataRedis,
      1 * 24 * 60 * 60
    );
    if (errRedis) throw Boom.internal("Redis error set key value");

    return Promise.resolve({
      ...(newToken && { newToken }),
      nextStep: (latestStep || 0) + 1,
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

    if (!redisData) throw Boom.notFound("Data in redis is not found!");

    if (redisData.latestStep !== 3 || redisData?.userId !== userId)
      throw Boom.badRequest("Data is not consistent!");

    if (!redisData?.step1 || !redisData?.step2 || !redisData?.step3)
      throw Boom.badRequest("Data is not completed!");

    // eslint-disable-next-line no-restricted-globals
    if (!redisData?.bidPrice || isNaN(redisData?.bidPrice))
      throw Boom.badRequest("Bid price is invalid!");

    // Step data validation
    const step1Data = redisData?.step1;
    // eslint-disable-next-line no-restricted-globals
    if (!step1Data?.addressInformation || isNaN(step1Data?.selectedAddressId))
      throw Boom.badRequest("Step 1 data is invalid!");

    const step2Data = redisData?.step2;
    // eslint-disable-next-line no-restricted-globals
    if (!step2Data?.providerInfo || isNaN(step2Data?.providerId))
      throw Boom.badRequest("Step 2 data is invalid!");

    const step3Data = redisData?.step3;
    // eslint-disable-next-line no-restricted-globals
    if (!step3Data?.paymentMethodInfo || isNaN(step3Data?.paymentMethodId))
      throw Boom.badRequest("Step 3 data is invalid!");

    // Prepare the data
    const getDateNow = new Date();
    getDateNow.setHours(
      getDateNow.getHours() + 7,
      getDateNow.getMinutes(),
      getDateNow.getSeconds(),
      getDateNow.getMilliseconds()
    );
    const dateNow = new Date(getDateNow).toISOString().slice(0, 10);
    const transactionId = `TRX/${dateNow}/${generateRandomString(5)}`;
    const adminPrice = 10000;
    const totalPrice =
      parseFloat(redisData?.bidPrice || 0) +
      parseFloat(step2Data?.providerInfo?.estPrice || 0) +
      adminPrice;

    const tokenSuccess = generateRandomString(15);

    const resXenditApi = await requestPaymentXendit(
      step3Data?.paymentMethodId,
      totalPrice,
      { sku: redisData?.itemData?.itemName },
      transactionId,
      userId,
      tokenSuccess
    );

    let xenditRedirectUrl = null;

    if (resXenditApi?.actions?.length > 0) {
      const resXenditActions = resXenditApi?.actions;

      // eslint-disable-next-line no-plusplus
      for (let index = 0; index < resXenditActions.length; index++) {
        const element = resXenditActions[index];

        if (element?.action === "AUTH") {
          xenditRedirectUrl = element.url;
        }
      }
    }

    if (!xenditRedirectUrl) throw Boom.internal("Api request error!");

    const resultTransaction = await db.sequelize.transaction(async () => {
      const bidDataDb = await db.bid.findOne({
        include: [
          {
            association: "item",
            required: true,
            attributes: ["userId"],
          },
        ],
        where: {
          id: redisData?.bidId,
          isActive: true,
          status: "WAITING",
        },
      });
      if (_.isEmpty(bidDataDb)) throw Boom.internal("Bid data is not found!");

      const bidData = {
        ...bidDataDb?.dataValues,
        sellerUserId: bidDataDb?.item?.dataValues?.userId,
      };

      const createPayment = await db.transaction.create({
        userId,
        sellerUserId: bidData?.sellerUserId,
        itemId: bidData?.itemId,
        bidId: redisData?.bidId,
        addressId: step1Data?.selectedAddressId,
        transactionCode: transactionId,
        totalPayment: totalPrice,
        bidPrice: redisData?.bidPrice,
        shippingPrice: step2Data?.providerInfo?.estPrice,
        paymentId: resXenditApi?.id,
        paymentJson: resXenditApi,
        paymentRedirUrl: xenditRedirectUrl,
      });
      if (!createPayment) throw Boom.internal("Create payment failed!");

      const updateBidData = await bidDataDb.update({ status: "WAIT_PAYMENT" });
      if (!updateBidData) throw Boom.internal("Bid data is not updated!");

      const errDelRedis = await deleteKeyJSONValue(`PAYMENT-DATA-${formId}`);
      if (errDelRedis) throw Boom.internal("Delete form date!");

      return createPayment?.id;
    });

    if (!resultTransaction)
      throw Boom.internal("Transaction data is not created!");

    await setKeyJSONValue(
      `TRANSACTION-${tokenSuccess}`,
      { id: redisData?.bidId, paymentId: resXenditApi?.id },
      2 * 60 * 60
    );

    return Promise.resolve({
      messageDb: "Transaction data created successfully",
      redirectUrl: xenditRedirectUrl,
    });
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

module.exports = {
  checkPaymentFormInitInfo,
  getFormData,
  getShipProvidersData,
  getPaymentMethods,
  getSummaryData,

  appendFormData,
  completeFormData,
};
