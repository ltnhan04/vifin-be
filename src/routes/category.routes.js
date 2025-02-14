const router = require("express").Router();
const {
  addCategory,
  updatedCategory,
  deletedCategory,
  getCategories,
} = require("../controllers/category.controller");

router.get("/", getCategories);
router.post("/", addCategory);
router.put("/:id", updatedCategory);
router.delete("/:id", deletedCategory);

module.exports = router;
