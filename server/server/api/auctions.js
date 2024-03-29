const Router = require("express").Router();
const Boom = require("boom");

const ValidationAuction = require("../helpers/validationAuction");
const AuctionHelper = require("../helpers/auctionHelper");
const GeneralHelper = require("../helpers/generalHelper");
const AuthMiddleware = require("../middlewares/authMiddleware");
const MulterMiddleware = require("../middlewares/multerMiddleware");
const { decryptData } = require("../helpers/utilsHelper");

const fileName = "server/api/auctions.js";

const getMyAuctions = async (request, reply) => {
  try {
    ValidationAuction.getMyAcutionValidation(request.query);

    const userData = GeneralHelper.getUserData(request);
    if (userData?.role !== "seller")
      throw Boom.unauthorized("User with this role cannot access!");

    const response = await AuctionHelper.getMyAuctionsData(
      request?.query,
      userData?.userId
    );

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Get All My Auction API", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const getMyAuctionDetail = async (request, reply) => {
  try {
    ValidationAuction.idValidation(request.query);

    const userData = GeneralHelper.getUserData(request);
    if (userData?.role !== "seller")
      throw Boom.unauthorized("User with this role cannot access!");

    const response = await AuctionHelper.getMyAuctionDetailData(
      request?.query,
      userData?.userId
    );

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Get My Auction Detail API", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const getCategories = async (request, reply) => {
  try {
    const response = await AuctionHelper.getCategories();

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Get Categories API", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const getLatestAuctions = async (request, reply) => {
  try {
    const response = await AuctionHelper.getLatestAuctionsData();

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Get Latest Auction API", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const getFiveMinAuction = async (request, reply) => {
  try {
    const response = await AuctionHelper.getFiveMinAuctionsData();

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Get Five Min Auction API", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const getAllAuctions = async (request, reply) => {
  try {
    ValidationAuction.getAllAuctionValidation(request?.query);

    const response = await AuctionHelper.getAllAuctions(request?.query);

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Get All Auction API", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const getAuctionDetail = async (request, reply) => {
  try {
    ValidationAuction.idValidation(request?.query);

    const response = await AuctionHelper.getAuctionDetail(request?.query);

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Get Auction Detail API", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const createNewAuction = async (request, reply) => {
  try {
    ValidationAuction.createNewAuctionValidation(request.body);

    const { itemGeneralData, itemSpecificationData } = request.body;

    let decryptedGeneral = null;
    let decrypteditemSpec = null;

    try {
      decryptedGeneral = JSON.parse(decryptData(itemGeneralData));
      decrypteditemSpec = JSON.parse(decryptData(itemSpecificationData));
    } catch (error) {
      throw Boom.badRequest("Form data is invalid!");
    }

    ValidationAuction.generalAuctionFormDataValidation(decryptedGeneral);
    ValidationAuction.specAuctionFormDataValidation(decrypteditemSpec);
    const imageFiles = request?.files?.images;

    const userData = GeneralHelper.getUserData(request);
    if (userData?.role !== "seller")
      throw Boom.unauthorized("User with this role cannot access!");

    const response = await AuctionHelper.createNewAuctionItem(
      request?.body,
      imageFiles,
      userData.userId
    );

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Create Item Auction API", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const updateAuction = async (request, reply) => {
  try {
    ValidationAuction.editAuctionValidation(request.body);

    const { itemGeneralData, itemSpecificationData } = request.body;

    let decryptedGeneral = null;
    let decrypteditemSpec = null;

    try {
      decryptedGeneral = JSON.parse(decryptData(itemGeneralData));
      decrypteditemSpec = JSON.parse(decryptData(itemSpecificationData));
    } catch (error) {
      throw Boom.badRequest("Form data is invalid!");
    }

    ValidationAuction.generalAuctionFormDataValidation(decryptedGeneral);
    ValidationAuction.specAuctionFormDataValidation(decrypteditemSpec);

    const imageFiles = request?.files?.images;

    const userData = GeneralHelper.getUserData(request);
    if (userData?.role !== "seller")
      throw Boom.unauthorized("User with this role cannot access!");

    const response = await AuctionHelper.editAuctionItem(
      request?.body,
      imageFiles,
      userData.userId
    );

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Update Item Auction API", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const deleteAuction = async (request, reply) => {
  try {
    ValidationAuction.idValidation(request.body);

    const userData = GeneralHelper.getUserData(request);
    if (userData?.role !== "seller")
      throw Boom.unauthorized("User with this role cannot access!");

    const response = await AuctionHelper.deleteAuctionItemData(
      request?.body,
      userData.userId
    );

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Delete Item Auction API", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

// Authenticated Only Routes
Router.get(
  "/auctions/my-auctions",
  AuthMiddleware.validateToken,
  getMyAuctions
);
Router.get(
  "/auctions/my-auctions/detail",
  AuthMiddleware.validateToken,
  getMyAuctionDetail
);
Router.get("/auctions/categories", getCategories);
Router.get("/auctions/latest", getLatestAuctions);
Router.get("/auctions/fivemin", getFiveMinAuction);
Router.get("/auctions", getAllAuctions);
Router.get("/auctions/detail", getAuctionDetail);

Router.put(
  "/auctions/new",
  AuthMiddleware.validateToken,
  MulterMiddleware.fields([{ name: "images", maxCount: 8 }]),
  createNewAuction
);

Router.patch(
  "/auctions/edit",
  AuthMiddleware.validateToken,
  MulterMiddleware.fields([{ name: "images", maxCount: 8 }]),
  updateAuction
);

Router.delete("/auctions/delete", AuthMiddleware.validateToken, deleteAuction);

module.exports = Router;
