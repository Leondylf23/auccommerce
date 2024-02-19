const _ = require("lodash");
const Boom = require("boom");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("../../models");
const GeneralHelper = require("./generalHelper");
const { encryptData, generateRandomString } = require("./utilsHelper");
const cloudinary = require("../services/cloudinary");

const passwordSaltRound = bcrypt.genSaltSync(12);
const signatureSecretKey = process.env.SIGN_SECRET_KEY || "pgJApn9pJ8";
const sessionAge = process.env.SESSION_AGE || "365d";

// PRIVATE FUNCTIONS
const __generateHashPassword = (password) =>
  bcrypt.hashSync(password, passwordSaltRound);

const __compareHashPassword = (inputedPassword, hashedPassword) =>
  bcrypt.compareSync(inputedPassword, hashedPassword);

// AUTH USER HELPERS FUNCTIONS
const loginAuthentication = async (dataObject) => {
  const { email, password } = dataObject;

  try {
    const data = await db.user.findOne({
      where: { email },
    });

    if (_.isEmpty(data))
      throw Boom.unauthorized("Account not found from this email!");

    const hashedPassword = data?.dataValues?.password;
    const isValid = __compareHashPassword(password, hashedPassword);

    if (!isValid) throw Boom.unauthorized("Wrong email or password!");

    const fullname = data?.dataValues?.fullname;
    const profileImage = data?.dataValues?.profileImage;
    const role = data?.dataValues?.role;
    const userId = data?.dataValues?.id;
    const constructData = { userId, role };
    const frontEndUserData = {
      fullname,
      profileImage,
      role,
    };
    const encryptedUserData = encryptData(JSON.stringify(frontEndUserData));
    const token = jwt.sign(constructData, signatureSecretKey, {
      expiresIn: sessionAge,
    });

    return Promise.resolve({
      token,
      userData: encryptedUserData,
    });
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const registerUser = async (dataObject) => {
  const { fullname, dob, email, password, role, location } = dataObject;

  try {
    const checkData = await db.user.findOne({
      where: { email },
    });

    if (!_.isEmpty(checkData)) throw Boom.badData("Email already used!");

    const hashedPassword = __generateHashPassword(password);

    const createdUser = await db.user.create({
      fullname,
      dob,
      email,
      password: hashedPassword,
      role,
      location,
    });
    if (_.isEmpty(createdUser)) throw Boom.internal("User not created!");

    return Promise.resolve({
      message: "Register success, please login with new credentials!",
    });
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const getUserProfile = async (userId) => {
  try {
    const data = await db.user.findOne({
      attributes: [
        "email",
        "fullname",
        "location",
        "profileImage",
        "dob",
        "role",
        "createdAt",
      ],
      where: { id: userId },
    });

    if (_.isEmpty(data))
      throw Boom.badData("Profile data not found, maybe bad session data!");

    const dataValue = data?.dataValues;
    const filteredData = {
      ...dataValue,
      createdAt: new Date(dataValue?.createdAt)
        ?.toISOString()
        .slice(0, 10)
        .replace("-", "/")
        .replace("-", "/"),
      dob: new Date(dataValue?.dob)?.toISOString().slice(0, 10),
    };

    return Promise.resolve(filteredData);
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const changePassword = async (dataObject, userId) => {
  const { oldPassword, newPassword } = dataObject;

  try {
    const data = await db.user.findByPk(userId);

    if (_.isEmpty(data))
      throw Boom.badData("Profile data not found, maybe bad session data!");

    const hashedOldPassword = data?.dataValues?.password;
    const isValid = __compareHashPassword(oldPassword, hashedOldPassword);

    if (!isValid) throw Boom.unauthorized("Wrong old password!");

    const hashedNewPassword = __generateHashPassword(newPassword);
    const checkUpdate = await data.update({ password: hashedNewPassword });
    if (_.isEmpty(checkUpdate)) throw Boom.internal("Password not updated!");

    return Promise.resolve({
      message: "Password updated! Next time login use new password...",
    });
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const resetPassword = async (dataObject) => {
  const { email } = dataObject;

  try {
    const data = await db.user.findOne({ where: { email } });

    if (_.isEmpty(data)) throw Boom.badData("Unknown email!");

    const randomString = generateRandomString(14);
    const hashedNewPassword = __generateHashPassword(randomString);
    const checkUpdate = await data.update({ password: hashedNewPassword });
    if (_.isEmpty(checkUpdate)) throw Boom.internal("Password not reset!");

    return Promise.resolve({
      message: "Password has been reset, please use new password!",
      newPassword: encryptData(randomString),
    });
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const updateProfile = async (dataObject, imageFile, userId) => {
  const { fullname, dob, location } = dataObject;
  console.log(location);

  try {
    const data = await db.user.findByPk(userId);

    if (location && data.role !== "business") {
      throw Boom.unauthorized(
        "You are a customer. Cannot update store location"
      );
    }

    if (_.isEmpty(data))
      throw Boom.badData("Profile data not found, maybe bad session data!");

    let imageResult = null;
    if (imageFile) {
      imageResult = await cloudinary.uploadToCloudinary(imageFile, "image");
      if (!imageResult) throw Boom.internal("Cloudinary image upload failed");
    }

    const checkUpdate = await data.update({
      fullname,
      dob,
      location,
      ...(imageResult && { profileImage: imageResult?.url }),
    });
    if (_.isEmpty(checkUpdate)) throw Boom.internal("Profile not updated!");

    return Promise.resolve({
      message: "Profile updated!",
      ...(imageResult && { imageUpdate: imageResult?.url }),
    });
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

module.exports = {
  loginAuthentication,
  registerUser,
  getUserProfile,
  changePassword,
  resetPassword,
  updateProfile,
};
