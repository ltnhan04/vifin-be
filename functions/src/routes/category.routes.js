const router = require("express").Router();
const {
  addCategory,
  updatedCategory,
  deletedCategory,
  getCategories,
  getCategory,
  searchCategory,
} = require("../controllers/category.controller");
const { authenticateToken } = require("../middlewares/auth.middleware");
const { uploadImage } = require("../utils/upload");
const {
  validateCreateCategory,
  validateUpdateCategory,
} = require("../middlewares/validations/validate.category");

router.get("/", authenticateToken, getCategories);
router.get("/search", authenticateToken, searchCategory);
router.get("/:id", authenticateToken, getCategory);
router.post("/", validateCreateCategory, uploadImage, addCategory);
router.put(
  "/:id",
  authenticateToken,
  validateUpdateCategory,
  uploadImage,
  updatedCategory
);
router.delete("/:id", authenticateToken, deletedCategory);

module.exports = router;
