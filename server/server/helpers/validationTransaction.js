const Joi = require("joi");
const Boom = require("boom");

const idValidation = (data) => {
  const schema = Joi.object({
    id: Joi.number().required(),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const transactionCodeValidation = (data) => {
  const schema = Joi.object({
    transactioncode: Joi.string().required(),
    token: Joi.string().required(),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

module.exports = {
  idValidation,
  transactionCodeValidation,
};
