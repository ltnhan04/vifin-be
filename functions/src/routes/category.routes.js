const router = require("express").Router();
const {
  addCategory,
  updatedCategory,
  deletedCategory,
  getCategories,
  getCategory,
} = require("../controllers/category.controller");
const { authenticateToken } = require("../middlewares/auth.middleware");
const { uploadImage } = require("../utils/upload");

router.post("/", uploadImage, addCategory);
router.get("/", authenticateToken, getCategories);
router.get("/:id", authenticateToken, getCategory);
router.put("/:id", authenticateToken, uploadImage, updatedCategory);
router.delete("/:id", authenticateToken, deletedCategory);

module.exports = router;
