const router = require("express").Router();
const { authenticateToken } = require("../middlewares/auth.middleware");
const {
  createCustomer,
  getCustomers,
} = require("../controllers/customer.controller");

router.post("/", authenticateToken, createCustomer);
router.get("/", authenticateToken, getCustomers);

module.exports = router;
