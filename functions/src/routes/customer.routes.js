const router = require("express").Router();
const { authenticateToken } = require("../middlewares/auth.middleware");
const {
  createCustomer,
  getCustomers,
  updateCustomer,
} = require("../controllers/customer.controller");
const { uploadImage } = require("../utils/upload");

router.get("/:id", getCustomers);
router.post("/", authenticateToken, createCustomer);
router.put("/:id", authenticateToken, uploadImage, updateCustomer);

module.exports = router;
