const googleAI = require("../configs/googleAI.config");
const CategoryService = require("../services/category.service");
const ErrorHandler = require("../middlewares/error.handler");

class BillService {
  static InvoiceDataExtraction = async ({ text, customerId }) => {
    const listCategory = await CategoryService.getCategories(customerId);
    const categories = await CategoryService.filterCategoryName(listCategory);
    const prompt = `Bạn là một AI trích xuất dữ liệu từ hóa đơn.
Trong mỗi sản phẩm, giá tiền cuối cùng là thành tiền của sản phẩm đó.
Tổng hóa đơn phải bằng tổng giá sản phẩm cộng với các khoản thuế/phí (nếu có).
Hãy trích xuất thông tin từ văn bản đầu vào và trả về dữ liệu dưới định dạng JSON với cấu trúc:
{
  "storeName": "string",
  "date": "YYYY-MM-DD",
  "invoiceNumber": "string",
  "items": [
    {
      "name": "string",
      "price": number
    }
  ],
  "total": number,
  "type": "income | expense",
  "category": "string"
}

Phân loại hóa đơn:
1. Nếu hóa đơn là thu nhập, các từ khóa có thể bao gồm: Lương, Thu lãi, Tiền chuyển đến, Thu nhập khác, Nhận tiền, Lì xì, Thưởng hoặc mô tả liên quan đến việc nhận tiền từ người khác.
   - Ví dụ: "Nhận tiền từ NGUYỄN VĂN A, số tiền +1,000,000₫" hoặc "Lương tháng 1: +10,000,000₫"
2. Nếu hóa đơn liên quan đến việc mua hàng, sửa chữa, hoặc dịch vụ (như mua nhớt, sửa xe, hóa đơn điện, nước...), hãy phân loại là chi tiêu.
   - Các từ khóa liên quan: Nhớt, Sửa xe, Công thay, Hóa đơn, Chi phí, Mua sắm, Thanh toán hoặc mô tả về việc thanh toán dịch vụ hoặc mua sắm.
   - Ví dụ: "Chuyển tiền đến BÙI NGỌC B, số tiền -500,000₫" hoặc "Thanh toán hóa đơn điện tháng 1: -200,000₫"
3. Nếu không xác định được từ khóa, hãy phân tích ngữ cảnh từ các hành động mô tả trong hóa đơn.
4. Category phải nằm trong ${categories}; nếu không xác định được, trả về "Other Expense".

Tiền tệ và định dạng số:
- Nhận diện đơn vị tiền tệ trong hóa đơn (VD: VND, USD, EUR, JPY, ...).
- Nếu đơn vị là VND hoặc không xác định được, giữ nguyên giá trị.
- **Nếu đơn vị được biểu diễn bằng ký hiệu "S" hoặc USD, coi đó là USD và chuyển đổi tất cả các giá trị (bao gồm giá sản phẩm và total) sang VND với tỷ giá 1 USD = 25.000 VND.** 
**Nếu đơn vị được biểu diễn bằng ký hiệu "B" hoặc THB, coi đó là Thai Baht(Thái) và chuyển đổi tất cả các giá trị (bao gồm giá sản phẩm và total) sang VND với tỷ giá 1.00 Thai Baht = 759 VND.**  
- Nếu đơn vị là các ngoại tệ khác (ví dụ: EUR, JPY), chuyển đổi về VND với tỷ giá phù hợp (giả định bạn có kiến thức về tỷ giá hiện tại).
Tiền tệ và định dạng số:
    - Nhận diện đơn vị tiền tệ trong hóa đơn (VD: VND, USD, EUR, JPY, ...).
    - Nếu đơn vị là VND hoặc không xác định được, giữ nguyên giá trị.
    - *Nếu đơn vị được biểu diễn bằng ký hiệu "S" hoặc USD, coi đó là USD và chuyển đổi tất cả các giá trị (bao gồm giá sản phẩm và total) sang VND với tỷ giá 1 USD = 25.000 VND.* 
    *Nếu đơn vị được biểu diễn bằng ký hiệu "B" hoặc THB, coi đó là Thai Baht(Thái) và chuyển đổi tất cả các giá trị (bao gồm giá sản phẩm và total) sang VND với tỷ giá 1.00 Thai Baht = 759 VND.*  
    - Nếu đơn vị là các ngoại tệ khác (ví dụ: EUR, JPY), chuyển đổi về VND với tỷ giá phù hợp (giả định bạn có kiến thức về tỷ giá hiện tại).
    - **Đảm bảo rằng tất cả các giá trị của "price" và "total" đều được chuyển về số VND theo chuẩn của Việt Nam.** Nghĩa là, sau khi chuyển đổi (nếu cần), chỉ trả về giá trị số (ví dụ: 250000) mà không có ký hiệu tiền tệ, và định dạng số phải tuân theo kiểu số của Việt Nam (không chứa ký hiệu ngoại tệ hay dấu phân cách không cần thiết).

Xử lý các định dạng số:
- Hãy chuẩn hóa các định dạng số như "1,000.00", "1.000,00", "1000" thành dạng số phù hợp.
Đầu vào:
"""
${text}
"""
Hãy trả về chuỗi JSON phù hợp, không nói thêm gì khác.`;

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

    let { storeName, date, invoiceNumber, items, total, type, category } =
      receiptData;
    storeName = storeName && storeName.trim() !== "" ? storeName : "N/A";
    invoiceNumber =
      invoiceNumber && invoiceNumber.trim() !== "" ? invoiceNumber : "N/A";
    storeName = storeName.replace(/^(dịch vụ|cửa hàng)\s+/i, "").trim();
    if (!items || !Array.isArray(items) || items.length === 0 || !total) {
      throw new ErrorHandler("Invalid invoice data.", 400);
    }
    if (!date) date = new Date().toISOString().split("T")[0];
    return { storeName, date, invoiceNumber, items, total, type, category };
  };
}

module.exports = BillService;
