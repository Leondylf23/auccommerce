const Router = require("express").Router();
const Boom = require("boom");

const ValidationOrderinAja = require("../helpers/validationOrderinAjaHelper");
const OrderinAjaHelper = require("../helpers/orderAjaHelper");
const GeneralHelper = require("../helpers/generalHelper");
const AuthMiddleware = require("../middlewares/authMiddleware");
const MulterMiddleware = require("../middlewares/multerMiddleware");
const UtilsHelper = require("../helpers/utilsHelper");

const fileName = "server/api/orderinAja.js";

// PRIVATE FUCNTIONS

// ROUTE FUNCTIONS
const allOrders = async (request, reply) => {
  try {
    const userData = GeneralHelper.getUserData(request);
    if (!(userData?.role === "customer"))
      throw Boom.unauthorized("User role not allowed!");

    const response = await OrderinAjaHelper.getAllOrder(
      userData?.userId,
      false
    );

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "All Orders API", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const getOrderDetail = async (request, reply) => {
  try {
    ValidationOrderinAja.idValidation(request.query);

    const userData = GeneralHelper.getUserData(request);
    if (!(userData?.role === "customer"))
      throw Boom.unauthorized("User role not allowed!");

    const formData = request.query;
    const response = await OrderinAjaHelper.getOrderDetailWithId(formData, false);

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Order Detail API", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const allBusinessOrders = async (request, reply) => {
  try {
    const userData = GeneralHelper.getUserData(request);
    if (!(userData?.role === "business"))
      throw Boom.unauthorized("User role not allowed!");

    const response = await OrderinAjaHelper.getAllOrder(userData?.userId, true);

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "All Orders API", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const getBusinessOrderDetail = async (request, reply) => {
  try {
    ValidationOrderinAja.idValidation(request.query);

    const userData = GeneralHelper.getUserData(request);
    if (!(userData?.role === "business"))
      throw Boom.unauthorized("User role not allowed!");

    const formData = request.query;
    const response = await OrderinAjaHelper.getOrderDetailWithId(formData, true);

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Order Detail API", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const allProducts = async (request, reply) => {
  try {
    ValidationOrderinAja.allProductQueryValidation(request.query);
    const response = await OrderinAjaHelper.getAllProducts(request.query);

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "All Product API", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const productDetail = async (request, reply) => {
  try {
    ValidationOrderinAja.idValidation(request.query);

    const formData = request.query;
    const response = await OrderinAjaHelper.getProductDetail(
      formData,
      null,
      false
    );

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Product Detail API", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const allMyProducts = async (request, reply) => {
  try {
    const userData = GeneralHelper.getUserData(request);
    if (!(userData?.role === "business"))
      throw Boom.unauthorized("User role not allowed!");

    const formData = request.query;
    const response = await OrderinAjaHelper.getAllProducts(
      formData,
      userData?.userId
    );

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "All My Product API", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const myProductDetail = async (request, reply) => {
  try {
    ValidationOrderinAja.idValidation(request.query);

    const userData = GeneralHelper.getUserData(request);
    if (!(userData?.role === "business"))
      throw Boom.unauthorized("User role not allowed!");

    const formData = request.query;
    const response = await OrderinAjaHelper.getProductDetail(
      formData,
      userData?.userId,
      true
    );

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "My Product Detail API", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const createProduct = async (request, reply) => {
  try {
    ValidationOrderinAja.productFormValidation(request.body);

    const userData = GeneralHelper.getUserData(request);
    if (!(userData?.role === "business"))
      throw Boom.unauthorized("User role not allowed!");

    const imageFile = request?.files?.imageData;
    if (!imageFile) throw Boom.badRequest("Image file required!");

    const formData = request.body;
    const response = await OrderinAjaHelper.addProduct(
      { ...formData, imageData: imageFile[0] },
      userData?.userId
    );

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Create Product API", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const createOrder = async (request, reply) => {
  try {
    ValidationOrderinAja.orderRequestValidation(request.body);

    const userData = GeneralHelper.getUserData(request);
    if (!(userData?.role === "customer"))
      throw Boom.unauthorized("User role not allowed!");

    const formData = request.body;

    let decryptData = null;
    try {
      decryptData = { ...JSON.parse(UtilsHelper.decryptData(formData?.data)) };
    } catch (error) {
      throw Boom.badRequest("Data decryption failed!");
    }

    ValidationOrderinAja.orderDataFormValidation(decryptData);

    const response = await OrderinAjaHelper.addOrder(
      decryptData,
      userData?.userId
    );

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Create Order API", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const editProduct = async (request, reply) => {
  try {
    ValidationOrderinAja.editProductFormValidation(request.body);

    const userData = GeneralHelper.getUserData(request);
    if (!(userData?.role === "business"))
      throw Boom.unauthorized("User role not allowed!");

    const imageFile = request?.files?.imageData;

    const formData = request.body;
    const response = await OrderinAjaHelper.editProductData(
      { ...formData, imageData: imageFile ? imageFile[0] : null },
      userData?.userId
    );
    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Edit Product Data API", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const updateOrderStatus = async (request, reply) => {
  try {
    ValidationOrderinAja.editOrderStatusValidation(request.body);

    const userData = GeneralHelper.getUserData(request);
    if (!(userData?.role === "business"))
      throw Boom.unauthorized("User role not allowed!");

    const formData = request.body;
    const response = await OrderinAjaHelper.updateStatusOrder(
      formData,
      userData?.userId
    );

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Delete Product Data API", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const deleteProduct = async (request, reply) => {
  try {
    ValidationOrderinAja.idValidation(request.body);

    const userData = GeneralHelper.getUserData(request);
    if (!(userData?.role === "business"))
      throw Boom.unauthorized("User role not allowed!");

    const formData = request.body;
    const response = await OrderinAjaHelper.deleteProduct(
      formData,
      userData?.userId
    );

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Delete Product Data API", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const bestSeller = async (request, reply) => {
  try {
    const response = await OrderinAjaHelper.getBestSeller();

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Best seller Product Data API", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

// Public Routes
Router.get("/product", allProducts);
Router.get("/product/detail", productDetail);
Router.get("/product/best-seller", bestSeller);

// Customer Role Only Routes
Router.get("/order", AuthMiddleware.validateToken, allOrders);
Router.get("/order/detail", AuthMiddleware.validateToken, getOrderDetail);

Router.post("/order/create", AuthMiddleware.validateToken, createOrder);

// Business Role Only Routes
Router.get("/order/business", AuthMiddleware.validateToken, allBusinessOrders);
Router.get(
  "/order/business/detail",
  AuthMiddleware.validateToken,
  getBusinessOrderDetail
);
Router.get("/product/my-products", AuthMiddleware.validateToken, allMyProducts);
Router.get(
  "/product/my-products/detail",
  AuthMiddleware.validateToken,
  myProductDetail
);

Router.put(
  "/product/create",
  AuthMiddleware.validateToken,
  MulterMiddleware.fields([{ name: "imageData", maxCount: 1 }]),
  createProduct
);

Router.patch(
  "/product/edit",
  AuthMiddleware.validateToken,
  MulterMiddleware.fields([{ name: "imageData", maxCount: 1 }]),
  editProduct
);
Router.patch(
  "/order/status/update",
  AuthMiddleware.validateToken,
  updateOrderStatus
);

Router.delete("/product/delete", AuthMiddleware.validateToken, deleteProduct);

module.exports = Router;
