const router = require("express").Router();
const { authenticateToken } = require("../middlewares/auth.middleware");
const { expenseClassification } = require("../controllers/bill.controller");

router.post("/", authenticateToken, expenseClassification);
module.exports = router;
