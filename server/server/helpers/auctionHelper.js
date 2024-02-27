const _ = require("lodash");
const Boom = require("boom");
const { lte, gte, like } = require("sequelize/lib/operators");

const db = require("../../models");
const GeneralHelper = require("./generalHelper");
const cloudinary = require("../services/cloudinary");
const { decryptData, encryptData } = require("./utilsHelper");

// PRIVATE FUNCTIONS
const __formatDateNonISO = (date) =>
  new Date(date).toISOString().replace("T", " ").slice(0, 19);

// AUCTION HELPERS FUNCTIONS
const getMyAuctionsData = async (dataObject, userId) => {
  const { nextId } = dataObject;

  try {
    let nextIdData = null;

    try {
      nextIdData = decryptData(nextId);
    } catch (error) {
      nextIdData = null;
    }

    const data = await db.item.findAll({
      attributes: [
        "id",
        "itemName",
        "itemPictures",
        ["itemDeadlineBid", "endsOn"],
        ["itemStartBidDate", "startDate"],
        ["itemStartBidPrice", "price"],
        "status",
        "createdAt",
      ],
      where: {
        userId,
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
      ...element?.dataValues,
      itemImage: element?.dataValues?.itemPictures[0],
      itemPictures: undefined,
    }));

    return Promise.resolve({
      nextId: next ? encryptData(next) : null,
      datas: remappedData,
    });
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const getMyAuctionDetailData = async (dataObject, userId) => {
  const { id } = dataObject;

  try {
    const data = await db.item.findOne({
      attributes: [
        "itemName",
        "itemPictures",
        ["itemDeadlineBid", "deadlineBid"],
        ["itemStartBidDate", "startBidDate"],
        ["itemStartBidPrice", "startBid"],
        ["itemDescription", "description"],
        "itemPhysicalSpec",
        "status",
        ["category", "categoryId"],
      ],
      where: { id, userId, isActive: true },
    });

    return Promise.resolve({
      itemGeneralData: {
        ...data?.dataValues,
        itemPictures: undefined,
        itemPhysicalSpec: undefined,
        deadlineBid: __formatDateNonISO(data?.dataValues?.deadlineBid),
        startBidDate: __formatDateNonISO(data?.dataValues?.startBidDate),
        status: undefined,
      },
      itemSpecificationData: data?.dataValues.itemPhysicalSpec,
      itemImages: data?.dataValues.itemPictures,
      isLive: data?.dataValues?.status === "LIVE",
    });
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const getCategories = async () => {
  try {
    const data = await db.category.findAll({
      attributes: ["id", "name", "nameId", "pictureUrl"],
      where: { isActive: true },
    });

    return Promise.resolve(data?.map((category) => category?.dataValues));
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const getLatestAuctionsData = async () => {
  try {
    const data = await db.item.findAll({
      attributes: [
        "id",
        "itemName",
        "itemPictures",
        ["itemDeadlineBid", "endsOn"],
        ["itemStartBidDate", "startDate"],
        ["itemStartBidPrice", "price"],
        "status",
      ],
      where: {
        isActive: true,
      },
      order: [["id", "DESC"]],
      limit: 15,
    });

    const remappedData = data?.map((element) => ({
      ...element?.dataValues,
      itemImage: element?.dataValues?.itemPictures[0],
      isLiveNow: element?.dataValues?.status === "LIVE",
      itemPictures: undefined,
      status: undefined
    }));

    return Promise.resolve(remappedData);
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const getFiveMinAuctionsData = async () => {
  try {
    const twoMinTime = new Date();
    twoMinTime.setHours(
      twoMinTime.getHours() + 7,
      twoMinTime.getMinutes() + 2,
      twoMinTime.getSeconds()
    );

    const fiveMinTime = new Date();
    fiveMinTime.setHours(
      fiveMinTime.getHours() + 7,
      fiveMinTime.getMinutes() + 5,
      fiveMinTime.getSeconds()
    );

    const twoMinTimeStr = new Date(twoMinTime)
      .toISOString()
      .replace("T", " ")
      .slice(0, 19);
    const fiveMinTimeStr = new Date(fiveMinTime)
      .toISOString()
      .replace("T", " ")
      .slice(0, 19);

    const data = await db.item.findAll({
      attributes: [
        "id",
        "itemName",
        "itemPictures",
        ["itemDeadlineBid", "endsOn"],
        ["itemStartBidDate", "startDate"],
        ["itemStartBidPrice", "price"],
        "status",
      ],
      where: {
        isActive: true,
        itemDeadlineBid: { [lte]: fiveMinTimeStr, [gte]: twoMinTimeStr },
      },
      order: [["id", "DESC"]],
      limit: 15,
    });

    const remappedData = data?.map((element) => ({
      ...element?.dataValues,
      itemImage: element?.dataValues?.itemPictures[0],
      isLiveNow: element?.dataValues?.status === "LIVE",
      itemPictures: undefined,
      status: undefined
    }));

    return Promise.resolve(remappedData);
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const getAllAuctions = async (dataObject) => {
  const { search, category, nextId } = dataObject;

  try {
    let nextIdData = null;

    try {
      nextIdData = decryptData(nextId);
    } catch (error) {
      nextIdData = null;
    }

    const data = await db.item.findAll({
      attributes: [
        "id",
        "itemName",
        "itemPictures",
        ["itemDeadlineBid", "endsOn"],
        ["itemStartBidDate", "startDate"],
        ["itemStartBidPrice", "price"],
        "status",
      ],
      where: {
        isActive: true,
        ...(search && { itemName: { [like]: `%${search}%` } }),
        ...(category && { category }),
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
      ...element?.dataValues,
      itemImage: element?.dataValues?.itemPictures[0],
      isLiveNow: element?.dataValues?.status === "LIVE",
      itemPictures: undefined,
      status: undefined
    }));

    return Promise.resolve({
      nextId: next,
      datas: remappedData,
    });
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const getAuctionDetail = async (dataObject) => {
  const { id } = dataObject;

  try {
    const data = await db.item.findOne({
      attributes: [
        "itemName",
        ["itemPictures", "itemImages"],
        "itemDescription",
        "itemDeadlineBid",
        "itemStartBidDate",
        ["itemStartBidPrice", "startingPrice"],
        "status",
      ],
      where: {
        id,
        isActive: true,
      },
    });

    const timeNow = new Date().getTime();
    const countStart = Math.ceil((new Date(data?.dataValues?.itemStartBidDate).getTime() - timeNow) / 1000);
    const countEnd = Math.ceil((new Date(data?.dataValues?.itemDeadlineBid).getTime() - timeNow) / 1000);

    return Promise.resolve({
      ...data?.dataValues,
      highestBid: 0,
      isLiveNow: data?.dataValues?.status === "LIVE",
      startingTimer: countStart,
      timeRemaining: countEnd,
      livePeoples: [],
      status: undefined,
      itemDeadlineBid: undefined,
      itemStartBidDate: undefined,
    });
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const createNewAuctionItem = async (dataObject, imageFiles, userId) => {
  const { itemGeneralData, itemSpecificationData } = dataObject;

  try {
    if (!(imageFiles?.length > 0))
      throw Boom.badRequest("At least have 1 image!");

    const imageResults = [];

    for (let index = 0; index < imageFiles.length; index++) {
      const image = imageFiles[index];

      const imageResult = await cloudinary.uploadToCloudinary(image, "image");
      if (!imageResult) throw Boom.internal("Cloudinary image upload failed");

      imageResults.push(imageResult?.url);
    }

    const createdData = await db.item.create({
      userId,
      itemName: JSON.parse(itemGeneralData)?.itemName,
      itemPictures: imageResults,
      itemDescription: JSON.parse(itemGeneralData)?.description,
      itemPhysicalSpec: JSON.parse(itemSpecificationData),
      itemStartBidPrice: JSON.parse(itemGeneralData)?.startBid,
      itemStartBidDate: JSON.parse(itemGeneralData)?.startBidDate,
      itemDeadlineBid: JSON.parse(itemGeneralData)?.deadlineBid,
      status: "ACTIVED",
      category: JSON.parse(itemGeneralData)?.categoryId,
    });

    if (!createdData) throw Boom.internal("Auction item is not created!");

    return Promise.resolve({
      createdId: createdData?.id,
    });
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const editAuctionItem = async (dataObject, imageFiles, userId) => {
  const { id, itemGeneralData, itemSpecificationData, imageArray } = dataObject;

  try {
    const itemData = await db.item.findOne({
      where: { id, isActive: true, userId },
    });
    if (_.isEmpty(itemData)) throw Boom.notFound("Data not found!");

    const imageResults = [];
    if (imageFiles?.length > 0) {
      for (let index = 0; index < imageFiles.length; index++) {
        const image = imageFiles[index];

        const imageResult = await cloudinary.uploadToCloudinary(image, "image");
        if (!imageResult) throw Boom.internal("Cloudinary image upload failed");

        imageResults.push(imageResult?.url);
      }
    }

    let existingImgs = [];
    try {
      existingImgs = JSON.parse(imageArray);
    } catch (error) {
      existingImgs = [];
    }

    const imagesData = [...existingImgs, ...imageResults];

    const updatedData = await itemData.update({
      itemName: JSON.parse(itemGeneralData)?.itemName,
      itemPictures: imagesData,
      itemDescription: JSON.parse(itemGeneralData)?.description,
      itemPhysicalSpec: JSON.parse(itemSpecificationData),
      itemStartBidPrice: JSON.parse(itemGeneralData)?.startBid,
      itemStartBidDate: JSON.parse(itemGeneralData)?.startBidDate,
      itemDeadlineBid: JSON.parse(itemGeneralData)?.deadlineBid,
      status: "ACTIVED",
      category: JSON.parse(itemGeneralData)?.categoryId,
    });

    if (!updatedData) throw Boom.internal("Auction item is not updated!");

    return Promise.resolve({
      updatedData: {
        itemGeneralData: JSON.parse(itemGeneralData),
        itemSpecificationData: JSON.parse(itemSpecificationData),
        itemImages: imagesData,
        isLive: false,
      },
    });
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

module.exports = {
  getMyAuctionsData,
  getMyAuctionDetailData,
  getCategories,
  getLatestAuctionsData,
  getFiveMinAuctionsData,
  getAllAuctions,
  getAuctionDetail,

  createNewAuctionItem,

  editAuctionItem,
};
