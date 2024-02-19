/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
const _ = require("lodash");

const Boom = require("boom");
const { like } = require("sequelize/lib/operators");

const db = require("../../models");
const GeneralHelper = require("./generalHelper");
const cloudinary = require("../services/cloudinary");
const { generateRandomString } = require("./utilsHelper");

// PRIVATE FUNCTIONS

// ORDER HELPERS FUNCTIONS
const getAllOrder = async (userId, isBusiness) => {
  try {
    const data = await db.order.findAll({
      include: (isBusiness ? [
        {
          association: "product",
          required: true,
          attributes: ["title", "imageUrl"],
          where: { ...(isBusiness && { isActive: true }) },
        },
        {
          association: "user",
          required: true,
          attributes: ["fullname"],
        }
      ] : [
        {
          association: "product",
          required: true,
          attributes: ["title", "imageUrl"],
          where: { ...(isBusiness && { isActive: true }) },
        },
      ]),
      where: {
        isActive: true,
        ...(isBusiness ? { businessUserId: userId } : { createdBy: userId }),
      },
      attributes: ["id", "transactionCode", "status"],
      order: [["createdAt", "DESC"]],
    });

    const remapData = data?.map((order) => ({
      ...order?.dataValues,
      ...order?.product?.dataValues,
      customer: order?.user?.dataValues?.fullname,
      user: undefined,
      product: undefined,
    }));

    return Promise.resolve(remapData);
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const getOrderDetailWithId = async (dataObject, isBusiness) => {
  try {
    const { id } = dataObject;
    const data = await db.order.findOne({
      include: (isBusiness ? [
        {
          association: "product",
          required: true,
          attributes: ["title", "imageUrl", "description"],
          include: [
            {
              association: "user",
              required: true,
              attributes: ["fullname", "location"],
            },
          ],
        },
        {
          association: "user",
          required: true,
          attributes: ["fullname"],
        },
      ] : [
        {
          association: "product",
          required: true,
          attributes: ["title", "imageUrl", "description"],
          include: [
            {
              association: "user",
              required: true,
              attributes: ["fullname", "location"],
            },
          ],
        },
      ]),
      attributes: ["transactionCode", "status", "paymentMethod", "address", "phone", "totalPayment"],
      where: { id, isActive: true },
    });

    if (_.isEmpty(data)) throw Boom.notFound("order detail is not found!");

    const remapData = {
      ...data?.dataValues,
      ...({
        ...data?.product?.dataValues,
        organization: data?.product?.user?.dataValues?.fullname,
        user: undefined
      }),
      location: data?.product?.user?.dataValues?.location,
      customer: data?.user?.fullname,
      product: undefined,
      user: undefined,
    };

    return Promise.resolve(remapData);
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const getAllProducts = async (dataObject, userId) => {
  const { productName, page } = dataObject;

  console.log(page, "<<<<<");

  const currentPage = Number(page) || 0;

  try {
    const data = await db.product.findAll({
      include: [
        {
          association: "user",
          required: true,
          where: { isActive: true },
          attributes: [["fullname", "organization"], "location"],
        },
      ],
      where: {
        isActive: true,
        ...(userId && { createdBy: userId }),
        ...(productName && { title: { [like]: `%${productName}%` } }),
      },
      attributes: ["id", "imageUrl", "title", "price"],
      limit: 6,
      offset: currentPage,
    });

    const remapData = data?.map((product) => {
      const productValues = product?.dataValues;

      return {
        organization: product?.user?.dataValues?.organization,
        location: product?.user?.dataValues?.location,
        ...productValues,
        user: undefined,
      };
    });

    return Promise.resolve(remapData);
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const getProductDetail = async (dataObject, userId, isBusiness) => {
  try {
    const { id } = dataObject;

    const data = await db.product.findOne({
      ...(!isBusiness && {
        include: [
          {
            association: "user",
            required: true,
            where: { isActive: true },
            attributes: [["fullname", "organization"], "location"],
          },
        ],
      }),
      where: {
        isActive: true,
        id,
      },
      attributes: { exclude: ["id", "isActive", "createdAt", "updatedAt"] },
    });

    if (_.isEmpty(data)) throw Boom.notFound("Product detail is not found!");

    const remapData = {
      ...data?.dataValues,
      createdBy: undefined,
      location: data?.product?.user?.dataValues?.location,
      ...(!isBusiness && {
        organization: data?.user?.dataValues?.organization,
        location: data?.user?.dataValues?.location,
      }),
    };

    if (isBusiness && data?.dataValues?.createdBy !== userId)
      throw Boom.badRequest("Cannot access other user data!");

    return Promise.resolve(remapData);
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const addProduct = async (dataObject, userId) => {
  try {
    const { title, price, description, imageData } = dataObject;

    const imageResult = await cloudinary.uploadToCloudinary(imageData, "image");
    if (!imageResult) throw Boom.internal("Cloudinary failed to upload image!");

    const data = await db.product.create({
      title,
      price,
      description,
      imageUrl: imageResult.url,
      createdBy: userId,
    });

    if (!data) throw Boom.internal("Create product failed!");

    const remapData = {
      ...data?.dataValues,
      createdBy: undefined,
      createdAt: undefined,
      isActive: undefined,
      id: undefined,
    };

    return Promise.resolve({
      createdId: data?.id,
      createdData: remapData,
    });
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const addOrder = async (dataObject, userId) => {
  try {
    const { productId, paymentMethod, totalPayment, orderForm } = dataObject;

    const checkProductId = await db.product.findOne({
      where: { id: productId, isActive: true },
    });
    if (_.isEmpty(checkProductId))
      throw Boom.notFound("Product not found from this id!");

    const dateNow = new Date().toISOString().slice(0, 10);
    const transactionId = `TRX/${dateNow}/${generateRandomString(5)}`;

    const createdOrder = await db.order.create({
      productId,
      paymentMethod,
      totalPayment,
      createdBy: userId,
      phone: orderForm?.phone,
      address: orderForm?.address,
      businessUserId: checkProductId?.dataValues?.createdBy,
      transactionCode: transactionId,
    });
    if (!createdOrder) throw new Error("Order not created!");

    return Promise.resolve({
      createdId: createdOrder?.id,
    });
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const editProductData = async (dataObject, userId) => {
  try {
    const { id, title, description, imageData, price } = dataObject;

    const data = await db.product.findOne({
      where: { id, isActive: true },
    });
    if (_.isEmpty(data)) throw Boom.notFound("Product not found!");

    const userIdCheck = data?.dataValues?.createdBy;
    if (userIdCheck !== userId)
      throw Boom.unauthorized(
        "Your user account does not allowed to modify other user data!"
      );

    let imageResult = null;
    if (imageData) {
      imageResult = await cloudinary.uploadToCloudinary(imageData, "image");
      if (!imageResult)
        throw Boom.internal("Cloudinary optional upload failed!");
    }

    await data.update({
      title,
      price,
      description,
      ...(imageResult && { imageUrl: imageResult?.url }),
    });

    const remapData = {
      ...data?.dataValues,
      createdBy: undefined,
      createdAt: undefined,
      isActive: undefined,
      id: undefined,
    };

    return Promise.resolve({
      updatedId: data?.id,
      updatedData: remapData,
    });
  } catch (err) {
    console.log(err);
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const updateStatusOrder = async (dataObject, userId) => {
  try {
    const { id, isSuccess } = dataObject;

    const data = await db.order.findOne({
      where: { id, isActive: true, status: "WAITING" },
    });
    if (_.isEmpty(data)) throw Boom.notFound("Order not found!");

    const userIdCheck = data?.dataValues?.businessUserId;
    if (userIdCheck !== userId)
      throw Boom.unauthorized(
        "Your user account does not allowed to modify other user data!"
      );

    await data.update({ status: isSuccess ? "SUCCESS" : "FAILED" });

    return Promise.resolve({
      updatedId: data?.id,
    });
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const deleteProduct = async (dataObject, userId) => {
  try {
    const { id } = dataObject;

    const data = await db.product.findOne({
      where: { id, isActive: true },
    });
    if (_.isEmpty(data)) throw Boom.notFound("Product not found!");

    const userIdCheck = data?.dataValues?.createdBy;
    if (userIdCheck !== userId)
      throw Boom.unauthorized(
        "Your user account does not allowed to modify other user data!"
      );

    await data.update({ isActive: false });

    return Promise.resolve({
      deletedId: data?.id,
    });
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const getBestSeller = async () => {
  try {
    const bestSellers = await db.order.findAll({
      where: {
        isActive: true,
      },
      attributes: [
        "productId",
        [
          db.sequelize.fn("COUNT", db.sequelize.col("productId")),
          "productCount",
        ],
      ],
      include: [
        {
          association: "product",
          attributes: { exclude: ["createdAt", "updatedAt"] },
          include: [
            {
              association: "user",
              required: true,
              where: { isActive: true },
              attributes: [["fullname", "organization"], "location"],
            },
          ],
        },
      ],
      group: "productId",
      order: [
        [db.sequelize.fn("COUNT", db.sequelize.col("productId")), "DESC"],
      ],
      limit: 10,
    });

    return Promise.resolve(bestSellers);
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

module.exports = {
  getAllOrder,
  getOrderDetailWithId,
  getAllProducts,
  getProductDetail,
  getBestSeller,

  addOrder,
  addProduct,

  editProductData,
  updateStatusOrder,

  deleteProduct,
};
