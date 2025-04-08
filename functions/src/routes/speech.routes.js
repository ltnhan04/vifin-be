const router = require("express").Router();
const { authenticateToken } = require("../middlewares/auth.middleware");
const {
  expenseClassificationByVoice,
  speechToText,
} = require("../controllers/speech.controller");

router.post("/", authenticateToken, expenseClassificationByVoice);
router.post("/transcribe", authenticateToken, speechToText);

module.exports = router;
