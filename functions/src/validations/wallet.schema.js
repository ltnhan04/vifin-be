const Joi = require("joi");

const createWalletSchema = Joi.object({
  amount: Joi.number().min(0).required(),
  currency_unit: Joi.string().valid("VND", "USD").required(),
  wallet_name: Joi.string().min(3).max(50).trim().required(),
}).unknown(true);

const updateWalletSchema = Joi.object({
  amount: Joi.number().min(0),
  currency_unit: Joi.string().valid("VND", "USD"),
  wallet_name: Joi.string().min(3).max(50).trim(),
})
  .min(1)
  .unknown(true);

module.exports = { createWalletSchema, updateWalletSchema };
