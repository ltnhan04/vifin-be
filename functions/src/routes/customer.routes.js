const router = require("express").Router();
const { authenticateToken } = require("../middlewares/auth.middleware");
const {
  createCustomer,
  getCustomers,
  updateCustomer,
  updatePushToken,
} = require("../controllers/customer.controller");
const { uploadImage } = require("../utils/upload");

router.get("/:id", getCustomers);
router.post("/", authenticateToken, createCustomer);
router.post("/push-token", authenticateToken, updatePushToken);
router.put("/:id", authenticateToken, uploadImage, updateCustomer);

module.exports = router;
