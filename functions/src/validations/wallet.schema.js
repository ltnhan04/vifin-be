const Joi = require("joi");

const createWalletSchema = Joi.object({
  amount: Joi.number().min(0).required().messages({
    "number.base": "Expected number, received string",
    "number.min": "Amount must be a positive number",
    "any.required": "amount is required",
  }),
  currency_unit: Joi.string().valid("VND", "USD").required().messages({
    "any.only": "Currency must be either VND or USD",
    "any.required": "currency_unit is required",
  }),
  wallet_name: Joi.string().min(3).max(50).trim().required().messages({
    "string.min": "Wallet name must be at least 3 characters long",
    "string.max": "Wallet name must not exceed 50 characters",
    "any.required": "wallet_name is required",
  }),
  symbol: Joi.string()
    .optional()
    .allow(null, "")
    .custom((value, helpers) => {
      if (value && !/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(value)) {
        return helpers.error("string.uri");
      }
      return value;
    })
    .messages({
      "string.uri": "Symbol must be a valid image URL (jpg, png, gif, jpeg)",
    }),
}).unknown(true);

const updateWalletSchema = Joi.object({
  amount: Joi.number().min(0).messages({
    "number.base": "Expected number, received string",
    "number.min": "Amount must be a positive number",
  }),
  currency_unit: Joi.string().valid("VND", "USD").messages({
    "any.only": "Currency must be either VND or USD",
  }),
  wallet_name: Joi.string().min(3).max(50).trim().messages({
    "string.min": "Wallet name must be at least 3 characters long",
    "string.max": "Wallet name must not exceed 50 characters",
  }),
})
  .min(1)
  .unknown(true);

module.exports = { createWalletSchema, updateWalletSchema };
