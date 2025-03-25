const {
  createCategorySchema,
  updateCategorySchema,
} = require("../../validations/category.schema");
const validateCreateCategory = (req, res, next) => {
  const { error } = createCategorySchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errors = {};
    error.details.forEach((err) => {
      const field = err.path.join(".");
      if (!errors[field]) {
        errors[field] = [];
      }
      errors[field].push(err.message);
    });

    return res.status(400).json({ errors });
  }
  next();
};

const validateUpdateCategory = (req, res, next) => {
  const { error } = updateCategorySchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res
      .status(400)
      .json({ message: error.details.map((d) => d.message) });
  }

  next();
};

module.exports = { validateCreateCategory, validateUpdateCategory };
