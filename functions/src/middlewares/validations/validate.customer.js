const updateProfileSchema = require("../../validations/profile.schema");

const validateUpdateProfile = (req, res, next) => {
  const { error } = updateProfileSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res
      .status(400)
      .json({ message: error.details.map((d) => d.message) });
  }

  next();
};

module.exports = { validateCreateProfile, validateUpdateProfile };
