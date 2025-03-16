const Joi = require("joi");

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  gender: Joi.string().valid("male", "female"),
}).min(1);

module.exports = updateProfileSchema;
