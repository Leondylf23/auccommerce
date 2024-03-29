const _ = require("lodash");
const Boom = require("boom");
const { lte, gte, like, not } = require("sequelize/lib/operators");

const db = require("../../models");
const GeneralHelper = require("./generalHelper");
const cloudinary = require("../services/cloudinary");
const { decryptData, encryptData } = require("./utilsHelper");
const redisService = require("../services/redis");
const { setTimerEventData } = require("../timers/ItemStatus");

const itemTimerEvents = setTimerEventData();

// PRIVATE FUNCTIONS
const __formatDateNonISO = (date, isShowSeconds) => {
  const data = new Date(date);
  data.setHours(
    data.getHours() + 7,
    data.getMinutes(),
    data.getSeconds(),
    data.getMilliseconds()
  );

  return new Date(data)
    .toISOString()
    .replace("T", " ")
    .slice(0, isShowSeconds ? 19 : 16);
};

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
        deadlineBid: __formatDateNonISO(data?.dataValues?.deadlineBid, false),
        startBidDate: __formatDateNonISO(data?.dataValues?.startBidDate, false),
        status: undefined,
      },
      itemSpecificationData: data?.dataValues.itemPhysicalSpec,
      itemImages: data?.dataValues.itemPictures,
      isEditable: data?.dataValues?.status === "ACTIVED",
      isDeletable: data?.dataValues?.status === "DEACTIVATED" || data?.dataValues?.status === "ACTIVED",
    });
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const getCategories = async () => {
  try {
    let data = null;
    const redisData = await redisService.getKeyJSONValue(`CATEGORIES`);

    if (redisData) {
      data = redisData;
    } else {
      const dbData = await db.category.findAll({
        attributes: ["id", "name", "nameId", "pictureUrl"],
        where: { isActive: true },
      });

      data = dbData?.map((dataEl) => dataEl?.dataValues);
      await redisService.setKeyJSONValue(`CATEGORIES`, data, 24 * 60 * 60);
    }

    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const getLatestAuctionsData = async () => {
  try {
    let data = null;

    const redisData = await redisService.getKeyJSONValue(`LATEST-ITEMS`);

    if (redisData) {
      data = redisData;
    } else {
      const dbData = await db.item.findAll({
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
          status: { [not]: "DEACTIVATED" },
        },
        order: [["updatedAt", "DESC"]],
        limit: 15,
      });

      data = dbData?.map((dataEl) => dataEl?.dataValues);
      await redisService.setKeyJSONValue(`LATEST-ITEMS`, data, 120);
    }

    const remappedData = data?.map((element) => ({
      ...element,
      itemImage: element?.itemPictures[0],
      isLiveNow: element?.status === "LIVE",
      itemPictures: undefined,
      status: undefined,
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
      status: undefined,
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
      status: undefined,
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
    let data;
    const redisData = await redisService.getKeyJSONValue(`ITEM-DETAIL-${id}`);

    if (!redisData) {
      const dbData = await db.item.findOne({
        attributes: [
          "itemName",
          ["itemPictures", "itemImages"],
          "itemDescription",
          "itemDeadlineBid",
          "itemStartBidDate",
          ["itemStartBidPrice", "startingPrice"],
          "status",
          [
            db.sequelize.literal(
              `(SELECT JSON_OBJECT('price', bidPlacePrice, 'userId', userid) FROM bids WHERE itemId = ${Number.parseInt(
                id
              )} ORDER BY bidPlacePrice DESC LIMIT 1)`
            ),
            "highestBid",
          ],
        ],
        where: {
          id,
          isActive: true,
        },
      });

      if (!dbData) throw Boom.notFound("Data not found");

      data = dbData.dataValues;
    } else {
      data = redisData;
    }

    const dateNow = new Date();

    const timeNow = new Date(dateNow).getTime();
    const countStart = Math.ceil(
      (new Date(data?.itemStartBidDate).getTime() - timeNow) / 1000
    );
    const countEnd = Math.ceil(
      (new Date(data?.itemDeadlineBid).getTime() - timeNow) / 1000
    );

    const liveDataRedis = await redisService.getKeyJSONValue(`LIVEBID-${id}`);

    await redisService.setKeyJSONValue(`ITEM-DETAIL-${id}`, data, 120);

    const mappedData = {
      ...data,
      startingPrice: Math.round(data.startingPrice),
      highestBid: liveDataRedis
        ? liveDataRedis?.highestBid
        : data?.startingPrice,
      isLiveNow: countStart < 0,
      startingTimer: countStart,
      timeRemaining: countEnd < 0 ? 0 : countEnd,
      itemDeadlineDate: data?.itemDeadlineBid,
      livePeoples: liveDataRedis ? liveDataRedis?.users : [],
      status: undefined,
      itemDeadlineBid: undefined,
      itemStartBidDate: undefined,
    };

    return Promise.resolve(mappedData);
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const createNewAuctionItem = async (dataObject, imageFiles, userId) => {
  const {
    itemGeneralData: encryptedItemGeneral,
    itemSpecificationData: encryptedItemSpec,
  } = dataObject;

  try {
    const itemGeneralData = decryptData(encryptedItemGeneral);
    const itemSpecificationData = decryptData(encryptedItemSpec);
    
    if (!(imageFiles?.length > 0))
      throw Boom.badRequest("At least have 1 image!");

    const imageResults = [];

    // eslint-disable-next-line no-plusplus
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

    itemTimerEvents.emit("ItemStatus/SET_NEW_TASK", {
      dataId: createdData?.id,
      dateActivate: JSON.parse(itemGeneralData)?.startBidDate,
      dataValue: { status: "LIVE" },
    });
    itemTimerEvents.emit("ItemStatus/SET_NEW_TASK", {
      dataId: createdData?.id,
      dateActivate: JSON.parse(itemGeneralData)?.deadlineBid,
      dataValue: { status: "DEACTIVATED" },
    });

    return Promise.resolve({
      createdId: createdData?.id,
    });
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const editAuctionItem = async (dataObject, imageFiles, userId) => {
  const {
    id,
    itemGeneralData: encryptedItemGeneral,
    itemSpecificationData: encryptedItemSpec,
    imageArray: encryptedImageArr,
  } = dataObject;

  try {
    const itemGeneralData = decryptData(encryptedItemGeneral);
    const itemSpecificationData = decryptData(encryptedItemSpec);
    const imageArray = decryptData(encryptedImageArr);

    const itemData = await db.item.findOne({
      where: { id, isActive: true, userId, status: { [not]: "LIVE" } },
    });
    if (_.isEmpty(itemData)) throw Boom.notFound("Data not found!");

    const imageResults = [];
    if (imageFiles?.length > 0) {
      // eslint-disable-next-line no-plusplus
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

    await redisService.deleteKeyJSONValue(`ITEM-DETAIL-${id}`);

    itemTimerEvents.emit("ItemStatus/STOP_TASK_BY_DATA_ID", {
      dataId: itemData?.id,
    });

    itemTimerEvents.emit("ItemStatus/SET_NEW_TASK", {
      dataId: itemData?.id,
      dateActivate: JSON.parse(itemGeneralData)?.startBidDate,
      dataValue: { status: "LIVE" },
    });
    itemTimerEvents.emit("ItemStatus/SET_NEW_TASK", {
      dataId: itemData?.id,
      dateActivate: JSON.parse(itemGeneralData)?.deadlineBid,
      dataValue: { status: "DEACTIVATED" },
    });

    return Promise.resolve({
      updatedData: {
        itemGeneralData: JSON.parse(itemGeneralData),
        itemSpecificationData: JSON.parse(itemSpecificationData),
        itemImages: imagesData,
        isEditable: true,
        isDeletable: true,
      },
    });
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const deleteAuctionItemData = async (dataObject, userId) => {
  const { id } = dataObject;

  try {
    const itemData = await db.item.findOne({
      where: { id, isActive: true, userId },
    });
    if (_.isEmpty(itemData)) throw Boom.notFound("Data not found!");

    const updatedData = await itemData.update({
      isActive: false,
    });

    if (!updatedData) throw Boom.internal("Auction item is not deleted!");

    itemTimerEvents.emit("ItemStatus/STOP_TASK_BY_DATA_ID", {
      dataId: itemData?.id,
    });

    return Promise.resolve({
      deletedId: id,
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

  deleteAuctionItemData,
};
