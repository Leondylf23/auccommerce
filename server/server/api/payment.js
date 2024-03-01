const Router = require("express").Router();
const Boom = require("boom");

const ValidationPayment = require("../helpers/validationPayment");
const PaymentHelper = require("../helpers/paymentHelper");
const GeneralHelper = require("../helpers/generalHelper");
const AuthMiddleware = require("../middlewares/authMiddleware");
const { decryptData } = require("../helpers/utilsHelper");

const fileName = "server/api/payment.js";

const checkPaymentForm = async (request, reply) => {
  try {
    ValidationPayment.checkPaymentFormInitInfoValidation(request.query);

    const userData = GeneralHelper.getUserData(request);
    if (userData?.role !== "buyer")
      throw Boom.unauthorized("User with this role cannot access!");

    const response = await PaymentHelper.getMyBidsData(
      request?.query,
      userData?.userId
    );

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Get All My Bids API", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const getFormDataInfo = async (request, reply) => {
  try {
    ValidationPayment.getFormDataValidation(request.query);

    const userData = GeneralHelper.getUserData(request);
    if (userData?.role !== "buyer")
      throw Boom.unauthorized("User with this role cannot access!");

    const response = await PaymentHelper.getMyBidsData(
      request?.query,
      userData?.userId
    );

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Get All My Bids API", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const appendNewFormData = async (request, reply) => {
  try {
    ValidationPayment.appendNewFormDataValidation(request.body);

    const userData = GeneralHelper.getUserData(request);
    if (userData?.role !== "buyer")
      throw Boom.unauthorized("User with this role cannot access!");

    const response = await PaymentHelper.getMyBidsData(
      request?.query,
      userData?.userId
    );

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Get All My Bids API", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const appendFormData = async (request, reply) => {
  try {
    ValidationPayment.appendFormDataValidation(request.body);

    const userData = GeneralHelper.getUserData(request);
    if (userData?.role !== "buyer")
      throw Boom.unauthorized("User with this role cannot access!");

    const response = await PaymentHelper.getMyBidsData(
      request?.query,
      userData?.userId
    );

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Get All My Bids API", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const completeFormData = async (request, reply) => {
  try {
    ValidationPayment.completeFormDataValidation(request.body);

    const userData = GeneralHelper.getUserData(request);
    if (userData?.role !== "buyer")
      throw Boom.unauthorized("User with this role cannot access!");

    const response = await PaymentHelper.getMyBidsData(
      request?.query,
      userData?.userId
    );

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Get All My Bids API", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

// Authenticated Only Routes
Router.get("/check-data", AuthMiddleware.validateToken, checkPaymentForm);
Router.get("/get-form-data", AuthMiddleware.validateToken, getFormDataInfo);

Router.post("/create-new-form", AuthMiddleware.validateToken, appendNewFormData);
Router.post("/append-form", AuthMiddleware.validateToken, appendFormData);
Router.post("/complete-form", AuthMiddleware.validateToken, completeFormData);

module.exports = Router;
