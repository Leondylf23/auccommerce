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

    const response = await PaymentHelper.checkPaymentFormInitInfo(
      request?.query,
      userData?.userId
    );

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Get Check Form API", "ERROR"], {
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

    const response = await PaymentHelper.getFormData(
      request?.query,
      userData?.userId
    );

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Get Form Info API", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const getShipProviderList = async (request, reply) => {
  try {
    ValidationPayment.tokenValidation(request.query);

    const userData = GeneralHelper.getUserData(request);
    if (userData?.role !== "buyer")
      throw Boom.unauthorized("User with this role cannot access!");

    const response = await PaymentHelper.getShipProvidersData(
      request?.query,
      userData?.userId
    );

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Get Ship Providers Info API", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const getPaymentMethods = async (request, reply) => {
  try {
    ValidationPayment.tokenValidation(request.query);

    const userData = GeneralHelper.getUserData(request);
    if (userData?.role !== "buyer")
      throw Boom.unauthorized("User with this role cannot access!");

    const response = await PaymentHelper.getPaymentMethods(
      request?.query,
      userData?.userId
    );

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Get Ship Providers Info API", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const getSummaryFormData = async (request, reply) => {
  try {
    ValidationPayment.tokenValidation(request.query);

    const userData = GeneralHelper.getUserData(request);
    if (userData?.role !== "buyer")
      throw Boom.unauthorized("User with this role cannot access!");

    const response = await PaymentHelper.getSummaryData(
      request?.query,
      userData?.userId
    );

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Get Summary Data API", "ERROR"], {
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

    const response = await PaymentHelper.appendFormData(
      request?.body,
      userData?.userId
    );

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Append Payment Form API", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const completeFormData = async (request, reply) => {
  try {
    ValidationPayment.tokenValidation(request.body);

    const userData = GeneralHelper.getUserData(request);
    if (userData?.role !== "buyer")
      throw Boom.unauthorized("User with this role cannot access!");

    const response = await PaymentHelper.completeFormData(
      request?.body,
      userData?.userId
    );

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Complete Payment Form API", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

// Authenticated Only Routes
Router.get("/check-data", AuthMiddleware.validateToken, checkPaymentForm);
Router.get("/get-form-data", AuthMiddleware.validateToken, getFormDataInfo);
Router.get("/get-shipment-providers", AuthMiddleware.validateToken, getShipProviderList);
Router.get("/get-payment-methods", AuthMiddleware.validateToken, getPaymentMethods);
Router.get("/get-form-summary", AuthMiddleware.validateToken, getSummaryFormData);

Router.post("/append-form", AuthMiddleware.validateToken, appendFormData);
Router.post("/complete-form", AuthMiddleware.validateToken, completeFormData);

module.exports = Router;
