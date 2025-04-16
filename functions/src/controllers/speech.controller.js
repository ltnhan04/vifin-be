const SpeechService = require("../services/speech.service");
const ResponseHandler = require("../utils/response.handler");

const expenseClassificationByVoice = async (req, res, next) => {
  try {
    const customerId = req.customer.user_id;
    const categorizedExpense = await SpeechService.categorizedExpense({
      ...req.body,
      customerId: customerId,
    });
    return ResponseHandler.sendSuccess(
      res,
      categorizedExpense,
      200,
      "Speech recognized successfully"
    );
  } catch (error) {
    next(error);
  }
};

const speechToText = async (req, res, next) => {
  try {
    const data = req.body;
    const audioUrl = data.audioUrl;
    const audioConfig = data.audioConfig;
    const text = await SpeechService.speechToText(audioUrl, audioConfig);
    return ResponseHandler.sendSuccess(
      res,
      text,
      200,
      "Speech recognized successfully"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { expenseClassificationByVoice, speechToText };
