const _ = require("lodash");
const Boom = require("boom");
const { lte } = require("sequelize/lib/operators");

const db = require("../../models");
const GeneralHelper = require("./generalHelper");
const cloudinary = require("../services/cloudinary");
const { decryptData, encryptData } = require("./utilsHelper");

// PRIVATE FUNCTIONS
const __formatDateNonISO = (date) =>
  new Date(date).toISOString().replace("T", " ").slice(0, 19);

// AUTH USER HELPERS FUNCTIONS
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
      next = data[9]?.dataValues?.id;
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
        status: undefined
      },
      itemSpecificationData: data?.dataValues.itemPhysicalSpec,
      itemImages: JSON.parse(data?.dataValues.itemPictures),
      isLive: data?.dataValues?.status === "LIVE",
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
  createNewAuctionItem,
  editAuctionItem,
};
