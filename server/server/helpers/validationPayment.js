const Joi = require("joi");
const Boom = require("boom");

const checkPaymentFormInitInfoValidation = (data) => {
  const schema = Joi.object({
    token: Joi.string().required().description("Require token to continue"),
    bidId: Joi.number().required().description("Require bidId to continue"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const getFormDataValidation = (data) => {
  const schema = Joi.object({
    token: Joi.string().required().description("Require token to continue"),
    step: Joi.number().required().description("Require step to continue"),
    bidId: Joi.number().required().description("Require bidId to continue"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const appendFormDataValidation = (data) => {
  const schema = Joi.object({
    data: Joi.string().required().description("Require data key in encrypted"),
    token: Joi.string().optional().description("Append token to continue form data, otherwise it create new form"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const tokenValidation = (data) => {
  const schema = Joi.object({
    token: Joi.string().required().description("Require token to continue"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

module.exports = {
    checkPaymentFormInitInfoValidation,
    getFormDataValidation,
    appendFormDataValidation,
    tokenValidation,
};
