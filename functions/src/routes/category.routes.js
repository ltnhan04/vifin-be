const router = require("express").Router();
const {
  addCategory,
  updatedCategory,
  deletedCategory,
  getCategories,
} = require("../controllers/category.controller");
const { authenticateToken } = require("../middlewares/auth.middleware");

router.get("/", authenticateToken, getCategories);
router.post("/", addCategory);
router.put("/:id", authenticateToken, updatedCategory);
router.delete("/:id", authenticateToken, deletedCategory);

module.exports = router;
