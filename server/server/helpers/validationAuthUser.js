const Joi = require("joi");
const Boom = require("boom");

const loginFormValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().required().description("Valid email address"),
    password: Joi.string().required().description("Must fill password"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const registerFormValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required()
      .description("Valid email address"),
    password: Joi.string()
      .min(6)
      .max(20)
      .required()
      .description(
        "Password must be at least 6 characters and not more than 20 characters"
      ),
    fullname: Joi.string()
      .min(3)
      .max(255)
      .required()
      .description(
        "Full name must be at least 3 characters and not more than 255 characters and alphabetic characters"
      ),
    dob: Joi.date().required().description("Date of birth must be valid date"),
    role: Joi.string()
      .valid("buyer", "seller")
      .required()
      .description("Role must be filled"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const changePasswordFormValidation = (data) => {
  const schema = Joi.object({
    oldPassword: Joi.string()
      .min(6)
      .max(20)
      .required()
      .description(
        "Old password must be at least 6 characters and not more than 20 characters"
      ),
    newPassword: Joi.string()
      .min(6)
      .max(20)
      .required()
      .description(
        "New password must be at least 6 characters and not more than 20 characters"
      ),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const resetPasswordFormValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required()
      .description("Valid email address"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const updateProfileFormValidation = (data) => {
  const schema = Joi.object({
    fullname: Joi.string()
      .min(3)
      .max(255)
      .required()
      .description(
        "Full name must be at least 3 characters and not more than 255 characters and alphabetic characters"
      ),
    dob: Joi.date().required().description("Date of birth must be valid date"),
    location: Joi.string()
      .min(3)
      .max(255)
      .optional()
      .description(
        "Location must be at least 3 characters and not more than 255 characters and alphabetic characters"
      ),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const addressNewValidation = (data) => {
  const schema = Joi.object({
    label: Joi.string().required().min(3).max(255).description("Address label"),
    address: Joi.string().required().min(6).max(255).description("Address"),
    phone: Joi.string().required().min(10).max(14).description("Phone"),
    pic: Joi.string()
      .required()
      .min(3)
      .max(255)
      .description("Address reciever"),
    note: Joi.string().required().min(10).max(500).description("Address note"),
    postalCode: Joi.string()
      .required()
      .min(5)
      .max(5)
      .description("Address postal code"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const addressEditValidation = (data) => {
  const schema = Joi.object({
    id: Joi.number().required(),
    label: Joi.string().required().min(3).max(255).description("Address label"),
    address: Joi.string().required().min(6).max(255).description("Address"),
    phone: Joi.string().required().min(10).max(14).description("Phone"),
    pic: Joi.string()
      .required()
      .min(3)
      .max(255)
      .description("Address reciever"),
    note: Joi.string().required().min(10).max(500).description("Address note"),
    postalCode: Joi.string()
      .required()
      .min(5)
      .max(5)
      .description("Address postal code"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const idValidation = (data) => {
  const schema = Joi.object({
    id: Joi.number().required(),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

module.exports = {
  loginFormValidation,
  registerFormValidation,
  changePasswordFormValidation,
  resetPasswordFormValidation,
  updateProfileFormValidation,
  addressNewValidation,
  addressEditValidation,
  idValidation
};
