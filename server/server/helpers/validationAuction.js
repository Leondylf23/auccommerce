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

const getMyAcutionValidation = (data) => {
  const schema = Joi.object({
    nextId: Joi.string().description("Offset of the page"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const createNewAuctionValidation = (data) => {
  const schema = Joi.object({
    itemGeneralData: Joi.string()
      .required()
      .description("General information of item in json string"),
    itemSpecificationData: Joi.string()
      .required()
      .description("Specification of item physical in json string"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const editAuctionValidation = (data) => {
  const schema = Joi.object({
    id: Joi.number().required().description("Id of item in number"),
    imageArray: Joi.string().required().description("Image array in json"),
    itemGeneralData: Joi.string()
      .required()
      .description("General information of item in json string"),
    itemSpecificationData: Joi.string()
      .required()
      .description("Specification of item physical in json string"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const generalAuctionFormDataValidation = (data) => {
  const schema = Joi.object({
    itemName: Joi.string().min(5).max(255).description("Item name in string"),
    startBid: Joi.number()
      .min(5000)
      .max(50000000000)
      .description("Start bid in number min 5.000 and max 50.000.000.000"),
    startBidDate: Joi.date().description("Start bid date in date time"),
    deadlineBid: Joi.date().description("Deadline bid date in date time"),
    description: Joi.string()
      .min(10)
      .max(500)
      .description("Description in string"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

const specAuctionFormDataValidation = (data) => {
  const schema = Joi.object({
    length: Joi.number().min(1).description("Item spec length in number"),
    width: Joi.number().min(1).description("Item spec width in number"),
    height: Joi.number().min(1).description("Item spec height in number"),
    weight: Joi.number().min(1).description("Item spec weight in number"),
  });

  if (schema.validate(data).error) {
    throw Boom.badRequest(schema.validate(data).error);
  }
};

module.exports = {
  idValidation,
  getMyAcutionValidation,
  createNewAuctionValidation,
  editAuctionValidation,
  generalAuctionFormDataValidation,
  specAuctionFormDataValidation,
};
