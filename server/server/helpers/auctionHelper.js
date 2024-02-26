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

module.exports = {
  loginAuthentication,
};
