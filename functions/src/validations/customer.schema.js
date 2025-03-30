const Joi = require("joi");

const createCustomerSchema = Joi.object({
  avatar: Joi.string().uri().allow(null, ""),
  full_name: Joi.string()
    .min(2)
    .message("full_name must be at least 2 characters long")
    .max(50)
    .message("full_name must be at most 50 characters")
    .trim()
    .required(),
  gender: Joi.string().valid("male", "female").default("male"),
  email: Joi.string()
    .email()
    .pattern(/@gmail\.com$/)
    .required()
    .messages({
      "string.pattern.base": "Email must be a valid Gmail address (@gmail.com)",
    }),
  provider: Joi.string().valid("google.com", "password").optional(),
  role: Joi.string().default("customer"),
}).min(1);

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  gender: Joi.string().valid("male", "female"),
}).min(1);
module.exports = { updateProfileSchema, createCustomerSchema };
