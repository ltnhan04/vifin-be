const router = require("express").Router();
const { authenticateToken } = require("../middlewares/auth.middleware");
const { signUp, signIn } = require("../controllers/auth.controller");

router.post("/sign-up", authenticateToken, signUp);
router.get("/sign-in", authenticateToken, signIn);

module.exports = router;
