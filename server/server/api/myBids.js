const Router = require("express").Router();
const Boom = require("boom");

const ValidationMyBids = require("../helpers/validationMyBids");
const MyBidsHelper = require("../helpers/myBidsHelper");
const GeneralHelper = require("../helpers/generalHelper");
const AuthMiddleware = require("../middlewares/authMiddleware");
const { decryptData } = require("../helpers/utilsHelper");

const fileName = "server/api/myBids.js";

const getMyBids = async (request, reply) => {
  try {
    ValidationMyBids.getMyBidsValidation(request.query);

    const userData = GeneralHelper.getUserData(request);
    if (userData?.role !== "buyer")
      throw Boom.unauthorized("User with this role cannot access!");

    const response = await MyBidsHelper.getMyBidsData(
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

const getMyBidDetail = async (request, reply) => {
    try {
      ValidationMyBids.idValidation(request.query);
  
      const userData = GeneralHelper.getUserData(request);
      if (userData?.role !== "buyer")
        throw Boom.unauthorized("User with this role cannot access!");
  
      const response = await MyBidsHelper.getMyBidDetailData(
        request?.query,
        userData?.userId
      );
  
      return reply.send({
        message: "success",
        data: response,
      });
    } catch (err) {
      console.log([fileName, "Get My Bid Detail API", "ERROR"], {
        info: `${err}`,
      });
      return reply.send(GeneralHelper.errorResponse(err));
    }
  };


// Authenticated Only Routes
Router.get(
  "",
  AuthMiddleware.validateToken,
  getMyBids
);
Router.get(
    "/detail",
    AuthMiddleware.validateToken,
    getMyBidDetail
  );

module.exports = Router;
