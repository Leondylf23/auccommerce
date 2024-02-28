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

const getMyBidsValidation = (data) => {
  const schema = Joi.object({
    filter: Joi.string().optional().description("Filter data"),
    nextId: Joi.string().optional().description("Offset of data"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

module.exports = {
  idValidation,
  getMyBidsValidation,
};
