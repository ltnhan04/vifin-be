const BillService = require("../../src/services/bill.service");
const testCases = require("../data/billData");
const path = require("path");

jest.mock("../../src/configs/googleAI.config"), () => ({
  generateContent: jest.fn(async (prompt) => {
    if (prompt.includes("Đây không phải hóa đơn hợp lệ")) {
      return { response: { text: () => "Invalid response" } };
    }
    const mockResponses = {
      "Hóa đơn cửa hàng ABC": `{
        "storeName": "ABC",
        "date": "2024-03-15",
        "invoiceNumber": "INV12345",
        "items": [{"name": "Bánh mì", "price": 20000}, {"name": "Sữa", "price": 35000}],
        "total": 55000,
        "type": "expense",
        "category": "Other Expense"
      }`,
      "Lương tháng 3": `{
        "storeName": null,
        "date": "2024-03-15",
        "invoiceNumber": null,
        "items": [],
        "total": 10000000,
        "type": "income",
        "category": "Lương"
      }`,
      "Hóa đơn dịch vụ ABC": `{
        "storeName": "ABC",
        "date": "2024-03-10",
        "invoiceNumber": "INV5678",
        "items": [{"name": "Sửa xe", "price": 500000}],
        "total": 500000,
        "type": "expense",
        "category": "Sửa chữa"
      }`
    };
    return { response: { text: () => mockResponses[prompt.slice(0, 20)] || "{}" } };
  })
});

describe("BillService.InvoiceDataExtraction", () => {
  testCases.forEach(({ description, input, expected }) => {
    test(description, async () => {
      if (expected instanceof Error) {
        await expect(BillService.InvoiceDataExtraction({ text: input, customerId: 1 }))
          .rejects.toThrow(expected.message);
      } else {
        const result = await BillService.InvoiceDataExtraction({ text: input, customerId: 1 });
        expect(result).toEqual(expected);
      }
    });
  });
});
