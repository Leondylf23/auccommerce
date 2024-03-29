const _ = require("lodash");
const Boom = require("boom");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("../../models");
const GeneralHelper = require("./generalHelper");
const { encryptData, generateRandomString } = require("./utilsHelper");
const cloudinary = require("../services/cloudinary");
const { getKeyJSONValue, setKeyJSONValue, getKeyValue } = require("../services/redis");

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
    const profileImage = data?.dataValues?.pictureUrl;
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
  const { fullname, dob, email, password, role } = dataObject;

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
    });
    if (_.isEmpty(createdUser)) throw Boom.internal("User not created!");

    return Promise.resolve({
      message: "Register success, please login with new credentials!",
    });
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const getUserProfile = async (userId, isProfilePage) => {
  try {
    let data = null;
    const redisData = await getKeyJSONValue(`USER-DATA-${userId}`);

    if (redisData) {
      data = redisData;
    } else {
      const dbData = await db.user.findOne({
        attributes: [
          "email",
          "fullname",
          "pictureUrl",
          "dob",
          "role",
          "createdAt",
        ],
        where: { id: userId },
      });

      data = dbData?.dataValues;
    }

    if (_.isEmpty(data))
      throw Boom.badData("Profile data not found, maybe bad session data!");

    const err = await setKeyJSONValue(
      `USER-DATA-${userId}`,
      data,
      24 * 60 * 60
    );
    if (err) throw Boom.internal("Error set redis data!");

    let banTimer = null;
    const getBanData = await getKeyValue(`USER-BAN-${userId}`);
    if (getBanData) {
      banTimer = new Date(getBanData).toISOString();
    }

    const frontEndUserData = {
      fullname: data?.fullname,
      profileImage: data?.pictureUrl,
      role: data?.role,
    };
    const encryptedUserData = encryptData(JSON.stringify(frontEndUserData));
    const filteredData = isProfilePage
      ? {
          ...data,
          createdAt: new Date(data?.createdAt)
            ?.toISOString()
            .slice(0, 10)
            .replace("-", "/")
            .replace("-", "/"),
          dob: new Date(data?.dob)?.toISOString().slice(0, 10),
        }
      : {
          updateData: encryptedUserData,
          banTimer,
        };

    return Promise.resolve(filteredData);
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const getUserAddresses = async (userId) => {
  try {
    const data = await db.address.findAll({
      attributes: [
        "id",
        ["addressLabel", "label"],
        "address",
        "phone",
        ["picName", "pic"],
        ["addressNote", "note"],
        "postalCode",
      ],
      where: { userId, isActive: true },
    });

    return Promise.resolve(data);
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
  const { fullname, dob } = dataObject;

  try {
    const data = await db.user.findByPk(userId);

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
      ...(imageResult && { pictureUrl: imageResult?.url }),
    });
    if (_.isEmpty(checkUpdate)) throw Boom.internal("Profile not updated!");

    let redisData = await getKeyJSONValue(`USER-DATA-${userId}`);
    if (redisData) {
      redisData = {
        ...redisData,
        fullname,
        dob,
        ...(imageResult && { pictureUrl: imageResult?.url }),
      };

      await setKeyJSONValue(`USER-DATA-${userId}`, redisData, 24 * 60 * 60);
    }

    return Promise.resolve({
      message: "Profile updated!",
      ...(imageResult && { imageUpdate: imageResult?.url }),
    });
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const saveUserAddress = async (dataObject, userId, isEdit) => {
  const { id, label, address, phone, pic, note, postalCode } = dataObject;
  let modifiedId = "";

  try {
    if (isEdit) {
      const data = await db.address.findOne({ where: { id, isActive: true } });
      if (_.isEmpty(data)) throw Boom.badRequest("Unknown data!");
      if (data?.dataValues?.userId !== userId)
        throw Boom.unauthorized("Cannot edit other user data!");

      const checkUpdate = await data.update({
        addressLabel: label,
        address,
        phone,
        picName: pic,
        addressNote: note,
        postalCode,
      });

      if (_.isEmpty(checkUpdate)) throw Boom.internal("Address update failed!");
      modifiedId = id;
    } else {
      const { count } = await db.address.findAndCountAll({
        where: { userId, isActive: true },
      });

      if (count > 4) throw Boom.badRequest("Address cannot more than 5 items!");
      const checkInsert = await db.address.create({
        addressLabel: label,
        address,
        phone,
        picName: pic,
        addressNote: note,
        postalCode,
        userId,
      });

      if (_.isEmpty(checkInsert)) throw Boom.internal("Address insert failed!");
      modifiedId = checkInsert?.id;
    }

    return Promise.resolve({
      message: `Address has been ${isEdit ? "edited" : "created"}!`,
      ...(isEdit ? { modifiedId } : { createdId: modifiedId }),
    });
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

const deleteUserAddress = async (dataObject, userId) => {
  const { id } = dataObject;

  try {
    const data = await db.address.findOne({ where: { id, isActive: true } });
    if (_.isEmpty(data)) throw Boom.notFound("Unknown data!");
    if (data?.dataValues?.userId !== userId)
      throw Boom.unauthorized("Cannot delete other user data!");

    const checkUpdate = await data.update({
      isActive: false,
    });

    if (_.isEmpty(checkUpdate)) throw Boom.internal("Address update failed!");

    return Promise.resolve({
      message: `Address has been deleted successfully`,
    });
  } catch (err) {
    return Promise.reject(GeneralHelper.errorResponse(err));
  }
};

module.exports = {
  loginAuthentication,
  registerUser,
  getUserProfile,
  getUserAddresses,
  changePassword,
  resetPassword,
  updateProfile,
  saveUserAddress,
  deleteUserAddress,
};
