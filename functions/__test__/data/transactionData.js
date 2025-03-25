const validTransactionData = {
    amount: 1000, // Số hợp lệ
    category_id: "category123", // ID danh mục hợp lệ
    customer_id: "customer456", // Có thể null
    wallet_id: "wallet789", // ID ví hợp lệ
    transaction_type: "expense", // Chỉ chấp nhận "income" hoặc "expense"
    note: "Mua sắm tại siêu thị", // Có thể null hoặc chuỗi rỗng
};
const addTransactionTestCases = [
    {
        title: "✅ Tạo giao dịch hợp lệ",
        input: { ...validTransactionData },
        expected: { success: true },
    },
    //Amount
    {
        title: "❌ Lỗi: Amount không phải số",
        input: { ...validTransactionData, amount: "not_a_number" },
        expected: { success: false, error: "Expected number, received string" },
    },
    {
        title: "❌ Lỗi: Amount không phải số âm",
        input: { ...validTransactionData, amount: -10000 },
        expected: { success: false, error: "Amount must be a positive number" },
    },
    {
        title: "❌ Lỗi: Amount không chứa khoảng trắng",
        input: { ...validTransactionData, amount: "100 000" },
        expected: { success: false, error: "Expected number, received string" },
    },
    {
        title: "❌ Tạo ví thất bại với amount là số dương rất lớn",
        input: { ...validTransactionData, amount: 10000000000000000000 },
        expected: { success: false, error: "\"amount\" must be a safe number" },
    },
    {
        title: "❌ Lỗi: Thiếu amount",
        input: { ...validTransactionData, amount: undefined },
        expected: { success: false, error: "amount is required" },
    },
    //
    {
        title: "❌ Lỗi: Thiếu category_id",
        input: { ...validTransactionData, category_id: undefined },
        expected: { success: false, error: '"category_id" is required' },
    },
    {
        title: "❌ Lỗi: Thiếu wallet_id",
        input: { ...validTransactionData, wallet_id: undefined },
        expected: { success: false, error: '"wallet_id" is required' },
    },
    {
        title: "❌ Lỗi: Thiếu transaction_type",
        input: { ...validTransactionData, transaction_type: undefined },
        expected: { success: false, error: '"transaction_type" is required' },
    },
    {
        title: "❌ Lỗi: transaction_type không hợp lệ",
        input: { ...validTransactionData, transaction_type: "transfer" }, // Không hợp lệ
        expected: { success: false, error: "\"transaction_type\" must be one of [expense, income]" },
    },
    {
        title: "✅ Tạo giao dịch không có customer_id (cho phép null)",
        input: { ...validTransactionData, customer_id: null },
        expected: { success: true },
    },
    {
        title: "✅ Tạo giao dịch không có note (cho phép null)",
        input: { ...validTransactionData, note: null },
        expected: { success: true },
    },
    {
        title: "✅ Tạo giao dịch với note rỗng",
        input: { ...validTransactionData, note: "" },
        expected: { success: true },
    },
];

module.exports = { validTransactionData, addTransactionTestCases };
