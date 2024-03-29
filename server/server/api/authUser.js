const Router = require("express").Router();

const ValidationAuthUser = require("../helpers/validationAuthUser");
const AuthUserHelper = require("../helpers/authUserHelper");
const GeneralHelper = require("../helpers/generalHelper");
const AuthMiddleware = require("../middlewares/authMiddleware");
const MulterMiddleware = require("../middlewares/multerMiddleware");
const { decryptData } = require("../helpers/utilsHelper");

const fileName = "server/api/authUser.js";

const getUserProfileData = async (request, reply) => {
  try {
    const userData = GeneralHelper.getUserData(request);
    const response = await AuthUserHelper.getUserProfile(userData.userId, true);

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

const getUserFrontendData = async (request, reply) => {
  try {
    const userData = GeneralHelper.getUserData(request);
    const response = await AuthUserHelper.getUserProfile(userData.userId, false);

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Get User Frontend Data API", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const getUserAddressesData = async (request, reply) => {
  try {
    const userData = GeneralHelper.getUserData(request);
    const response = await AuthUserHelper.getUserAddresses(userData.userId);

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Get User Addresses API", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const login = async (request, reply) => {
  try {
    const formData = request.body;
    const decryptedData = {
      ...(formData?.email && { email: decryptData(formData?.email) }),
      ...(formData?.password && { password: decryptData(formData?.password) }),
    };

    ValidationAuthUser.loginFormValidation(decryptedData);

    const response = await AuthUserHelper.loginAuthentication(decryptedData);

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Login API", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const register = async (request, reply) => {
  try {
    const formData = request.body;
    const decryptedData = {
      ...(formData?.email && { email: decryptData(formData?.email) }),
      ...(formData?.password && { password: decryptData(formData?.password) }),
      ...(formData?.fullname && { fullname: decryptData(formData?.fullname) }),
      ...(formData?.dob && { dob: decryptData(formData?.dob) }),
      ...(formData?.role && { role: decryptData(formData?.role) }),
      ...(formData?.location && { location: decryptData(formData?.location) }),
    };

    ValidationAuthUser.registerFormValidation(decryptedData);

    const response = await AuthUserHelper.registerUser(decryptedData);

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Register API", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const changePassword = async (request, reply) => {
  try {
    const formData = {
      ...(request?.body?.oldPassword && {
        oldPassword: decryptData(request?.body?.oldPassword),
      }),
      ...(request?.body?.newPassword && {
        newPassword: decryptData(request?.body?.newPassword),
      }),
    };
    ValidationAuthUser.changePasswordFormValidation(formData);

    const userData = GeneralHelper.getUserData(request);
    const response = await AuthUserHelper.changePassword(
      formData,
      userData.userId
    );

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Change Password API", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const resetPassword = async (request, reply) => {
  try {
    ValidationAuthUser.resetPasswordFormValidation(request.body);

    const formData = request.body;
    const response = await AuthUserHelper.resetPassword(formData);

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Reset Password API", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const updateProfile = async (request, reply) => {
  try {
    ValidationAuthUser.updateProfileFormValidation(request.body);

    const userData = GeneralHelper.getUserData(request);
    const formData = request.body;
    const imageFile = request?.files?.imageData;
    const response = await AuthUserHelper.updateProfile(
      formData,
      imageFile ? imageFile[0] : null,
      userData.userId
    );

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Update Profile API", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const saveUserAddressNew = async (request, reply) => {
  try {
    ValidationAuthUser.addressNewValidation(request.body);

    const formData = request.body;
    const userData = GeneralHelper.getUserData(request);
    const response = await AuthUserHelper.saveUserAddress(
      formData,
      userData?.userId,
      false
    );

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Save New Address API", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const saveUserAddressEdit = async (request, reply) => {
  try {
    ValidationAuthUser.addressEditValidation(request.body);

    const formData = request.body;
    const userData = GeneralHelper.getUserData(request);
    const response = await AuthUserHelper.saveUserAddress(
      formData,
      userData?.userId,
      true
    );

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Save Edit Address API", "ERROR"], {
      info: `${err}`,
    });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const deleteUserAddress = async (request, reply) => {
  try {
    ValidationAuthUser.idValidation(request.body);

    const formData = request.body;
    const userData = GeneralHelper.getUserData(request);
    const response = await AuthUserHelper.deleteUserAddress(
      formData,
      userData?.userId
    );

    return reply.send({
      message: "success",
      data: response,
    });
  } catch (err) {
    console.log([fileName, "Delete Address API", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

// Public Routes
Router.post("/login", login);
Router.post("/register", register);
Router.post("/reset-password", resetPassword);

// Authenticated Only Routes
Router.get("/profile", AuthMiddleware.validateToken, getUserProfileData);
Router.get("/init-profile", AuthMiddleware.validateToken, getUserFrontendData);
Router.get(
  "/profile/addresses",
  AuthMiddleware.validateToken,
  getUserAddressesData
);

Router.post(
  "/profile/addresses/new",
  AuthMiddleware.validateToken,
  saveUserAddressNew
);

Router.patch(
  "/profile/addresses/edit",
  AuthMiddleware.validateToken,
  saveUserAddressEdit
);
Router.patch(
  "/profile/update",
  MulterMiddleware.fields([{ name: "imageData", maxCount: 1 }]),
  AuthMiddleware.validateToken,
  updateProfile
);
Router.patch("/change-password", AuthMiddleware.validateToken, changePassword);

Router.delete(
  "/profile/addresses/delete",
  AuthMiddleware.validateToken,
  deleteUserAddress
);

module.exports = Router;
