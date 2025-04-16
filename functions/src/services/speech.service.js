const dotenv = require("dotenv");
dotenv.config();
const googleAI = require("../configs/googleAI.config");
const CategoryService = require("../services/category.service");
const ErrorHandler = require("../middlewares/error.handler");
class SpeechService {
  static speechToText = async (audioUrl, audioConfig) => {
    if (!audioUrl) {
      throw new ErrorHandler("No audio url was provided", 422);
    }
    if (!audioConfig) {
      throw new ErrorHandler("No audio config was provided", 422);
    }
    const speechResults = await fetch(
      "https://speech.googleapis.com/v1/speech:recognize",
      {
        method: "POST",
        body: JSON.stringify({
          audio: {
            content: audioUrl,
          },
          config: audioConfig,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-goog-api-key": `${process.env.GOOGLE_SPEECH_TO_TEXT_API_KEY}`,
        },
      }
    )
      .then((response) => response.json())
      .catch((err) => console.log(err));
    console.log("speechResults", JSON.stringify(speechResults, null, 2));

    if (!speechResults.results || !speechResults.results[0]?.alternatives) {
      throw new ErrorHandler("Speech recognition failed", 500);
    }
    const transcript = speechResults.results[0].alternatives[0].transcript;
    return transcript;
  };
  static categorizedExpense = async ({ text, customerId }) => {
    const listCategory = await CategoryService.getCategories(customerId);
    const categories = await CategoryService.filterCategoryName(listCategory);
    const prompt = `Bạn là một AI phân tích nội dung được tạo ra từ giọng nói của người dùng.

Dưới đây là đoạn văn bản thu được từ giọng nói, có thể là một câu đơn giản hoặc mô tả chi tiết hành động tài chính mà người dùng vừa nói (ví dụ: "Mình vừa đi ăn trưa hết 120 nghìn tại Highland", hoặc "Hôm nay nhận lương tháng 3 là 15 triệu").

Hãy thực hiện các nhiệm vụ sau:

1. Phân tích và xác định:
  - **Tổng số tiền** liên quan đến giao dịch (giá trị số, không ký hiệu tiền tệ).
  - **Loại giao dịch**: income nếu là thu nhập, expense nếu là chi tiêu.
  - **Category**: xác định danh mục giao dịch phù hợp dựa trên nội dung câu nói.
    - Danh sách danh mục cho phép: ${categories}
    - Nếu không rõ danh mục, trả về: "Other Expense"

2. Đảm bảo các quy định sau:
  - Chỉ trả về một đối tượng JSON đúng định dạng như sau:

{
  "total": number,
  "type": "income" | "expense",
  "category": "string"
}

3. Lưu ý khi phân loại:
  - Nếu văn bản chứa các từ như: lương, nhận tiền, chuyển đến, lì xì, thưởng, thu nhập → là **income**
  - Nếu văn bản chứa: mua, ăn, cà phê, chi, trả, chuyển khoản, điện, nước, sửa, xăng, thuê → là **expense**

4. Tiền tệ và định dạng số:
  - Hãy tự động chuẩn hóa định dạng số: ví dụ "1.000", "1,000", "1000", "1.000,00", "1,000.00" → 1000 (VND)
  - Nếu trong câu có đơn vị ngoại tệ như USD, THB, hãy chuyển về VND theo tỷ giá:
    - USD: 1 USD = 25,000 VND
    - THB: 1 THB = 759 VND

Đầu vào:
"""
${text}
"""
Chỉ trả về chuỗi JSON, không ghi chú, không giải thích, không thêm ký hiệu tiền tệ.`;
    const response = await googleAI.generateContent(prompt);
    let aiResult = response.response
      .text()
      .replace(/```json|```/g, "")
      .trim();

    let receiptData;
    try {
      receiptData = JSON.parse(aiResult);
    } catch (err) {
      throw new ErrorHandler("Error parsing JSON from AI.", 400);
    }
    return receiptData;
  };
}

module.exports = SpeechService;
