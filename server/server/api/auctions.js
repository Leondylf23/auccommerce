const Router = require("express").Router();

const ValidationAuction = require("../helpers/validationAuction");
const AuctionHelper = require("../helpers/auctionHelper");
const GeneralHelper = require("../helpers/generalHelper");
const AuthMiddleware = require("../middlewares/authMiddleware");
const MulterMiddleware = require("../middlewares/multerMiddleware");
const { decryptData } = require("../helpers/utilsHelper");

const fileName = "server/api/authUser.js";

const createNewAuction = async (request, reply) => {
  try {
    ValidationAuction.createNewAuctionValidation(request.body);

    const { itemGeneralData, itemSpecificationData } = request.body;

    ValidationAuction.generalAuctionFormDataValidation(JSON.parse(itemGeneralData));
    ValidationAuction.specAuctionFormDataValidation(JSON.parse(itemSpecificationData));
    
    const userData = GeneralHelper.getUserData(request);
    const response = await AuctionHelper.getUserProfile(userData.userId);

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Get User Profile API", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

// Authenticated Only Routes
Router.get(
  "/auction/new",
  AuthMiddleware.validateToken,
  MulterMiddleware.fields([{ name: "images", maxCount: 8 }]),
  createNewAuction
);

module.exports = Router;
