const validCategoryData = {
    name: "Ăn uống", // Hợp lệ (từ 3-50 ký tự)
    symbol: "food_icon.png", // Cho phép thuộc tính không bắt buộc
    parent_id: "parent123", // Có thể là null
    createdBy: "user123", // Không bắt buộc, mặc định là "system"
    transaction_type: "expense", // Chỉ chấp nhận "expense" hoặc "income"
};

const addCategoryTestCases = [
    {
        title: "✅ Tạo danh mục hợp lệ",
        input: { ...validCategoryData },
        expected: { success: true },
    },
    {
        title: "✅ Tạo danh mục không có symbol",
        input: { ...validCategoryData, symbol: undefined },
        expected: { success: true },
    },
    {
        title: "✅ Tạo danh mục không có createBy(default là system)",
        input: { ...validCategoryData, createdBy: undefined },
        expected: { success: true },
    },
    {
        title: "❌ Lỗi: Thiếu name",
        input: { ...validCategoryData, name: undefined },
        expected: { success: false, error: "\"name\" is required" },
    },
    {
        title: "❌ Lỗi: name quá ngắn (< 3 ký tự)",
        input: { ...validCategoryData, name: "Ă" }, // 1 ký tự
        expected: { success: false, error: "name must be at least 3 characters" },
    },
    {
        title: "✅ Tạo danh mục với name có độ dài 3 ký tự",
        input: { ...validCategoryData, name: "abc" },
        expected: { success: true },
    },
    {
        title: "✅ Tạo danh mục với name có độ dài 4 ký tự",
        input: { ...validCategoryData, name: "abcd" },
        expected: { success: true },
    },
    {
        title: "✅ Tạo danh mục với name có độ dài 49 ký tự",
        input: { ...validCategoryData, name: "a".repeat(49) },
        expected: { success: true },
    },
    {
        title: "✅ Tạo danh mục với name có độ dài 50 ký tự",
        input: { ...validCategoryData, name: "a".repeat(50) },
        expected: { success: true },
    },
    {
        title: "✅ Tạo danh mục với name có khoảng trắng ở đầu",
        input: { ...validCategoryData, name: " Momo" },
        expected: { success: true },
    },
    {
        title: "❌ Lỗi: name quá dài (> 50 ký tự)",
        input: { ...validCategoryData, name: "A".repeat(51) }, // 51 ký tự
        expected: { success: false, error: "name must be at most 50 characters" },
    },
    {
        title: "✅ Tạo danh mục không có parent_id (cho phép null)",
        input: { ...validCategoryData, parent_id: null },
        expected: { success: true },
    },
    {
        title: "❌ Lỗi: transaction_type không hợp lệ",
        input: { ...validCategoryData, transaction_type: "salary" }, // Không hợp lệ
        expected: { success: false, error: "\"transaction_type\" must be one of [expense, income]" },
    },
    {
        title: "❌ Lỗi: Thiếu transaction_type",
        input: { ...validCategoryData, transaction_type: undefined },
        expected: { success: false, error: "\"transaction_type\" is required" },
    },
];

module.exports = { validCategoryData, addCategoryTestCases };
