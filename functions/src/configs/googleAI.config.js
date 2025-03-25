const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();
const googleAI = new GoogleGenerativeAI(
  "AIzaSyBPotpNDTQJ77IuEidDynbU10VXGRraspA"
).getGenerativeModel({ model: "gemini-2.0-flash" });

module.exports = googleAI;
