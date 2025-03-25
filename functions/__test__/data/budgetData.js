const { error } = require("firebase-functions/logger");

const validBudgetData = {
    category_id: "category123",
    wallet_id: "wallet456",
    startDate: "2025-01-01",
    dueDate: "2025-12-31",
    amount: 1000,
    repeat_type: "monthly",
    is_repeated: true,
    is_completed: false,
};

const createBudgetTestCases = [
    {
        title: "✅ Tạo ngân sách hợp lệ",
        input: { ...validBudgetData },
        expected: { success: true },
    },
    //Amount
    {
        title: "✅ Tạo ngân sách với amount (0)",
        input: { ...validBudgetData, amount: 0 },
        expected: { success: true },
    },
    {
        title: "❌ Lỗi: Thiếu amount",
        input: { ...validBudgetData, amount: undefined },
        expected: { success: false, error: "amount is required" },
    },
    {
        title: "❌ Lỗi: Amount không phải số",
        input: { ...validBudgetData, amount: "not_a_number" },
        expected: { success: false, error: "Amount must be a number" },
    },
    {
        title: "❌ Lỗi: Amount không phải số âm",
        input: { ...validBudgetData, amount: -10000 },
        expected: { success: false, error: "Amount must be at least 0" },
    },
    {
        title: "❌ Lỗi: Amount không chứa khoảng trắng",
        input: { ...validBudgetData, amount: "100 000" },
        expected: { success: false, error: "Amount must be a number" },
    },
    {
        title: "❌ Lỗi: Tạo ví thất bại với amount là số dương rất lớn",
        input: { ...validBudgetData, amount: 10000000000000000000 },
        expected: { success: false, error: "\"amount\" must be a safe number" },
    },
    //Category
    {
        title: "❌ Lỗi: Thiếu category_id",
        input: { ...validBudgetData, category_id: undefined },
        expected: { success: false, error: "Category is required" },
    },
    //Wallet
    {
        title: "❌ Lỗi: Thiếu wallet_id",
        input: { ...validBudgetData, wallet_id: undefined },
        expected: { success: false, error: "Wallet is required" },
    },
    //Date
    {
        title: "❌ Lỗi: Ngày bắt đầu lớn hơn ngày kết thúc",
        input: { ...validBudgetData, startDate: "2025-12-31", dueDate: "2025-01-01" },
        expected: { success: false, error: "Start date must be before or equal to due date" },
    },
    {
        title: "❌ Lỗi: Sai định dạng startDate",
        input: { ...validBudgetData, startDate: "20/12/2024", dueDate: "2025-01-01" },
        expected: { success: false, error: "\"startDate\" must be a valid date" },
    },
    {
        title: "❌ Lỗi: Sai định dạng dueDate",
        input: { ...validBudgetData, startDate: "2024-12-20", dueDate: "2025-31-01" },
        expected: { success: false, error: "\"dueDate\" must be a valid date" },
    },
    {
        title: "❌ Lỗi: Thiếu startDate",
        input: { ...validBudgetData, startDate: undefined },
        expected: { success: false, error: "\"startDate\" is required" },
    },
    {
        title: "❌ Lỗi: Thiếu dueDate",
        input: { ...validBudgetData, dueDate: undefined },
        expected: { success: false, error: "\"dueDate\" is required" },
    },
    //repeat type
    {
        title: "❌ Lỗi: Thiếu repeat_type",
        input: { ...validBudgetData, repeat_type: undefined },
        expected: { success: false, error: "\"repeat_type\" is required" },
    },
    {
        title: "❌ Lỗi: repeat_type không hợp lệ",
        input: { ...validBudgetData, repeat_type: "daily" },
        expected: { success: false, error: "\"repeat_type\" must be one of [monthly, weekly, yearly, custom]" },
    },
    {
        title: "❌ Lỗi: is_repeated không phải boolean",
        input: { ...validBudgetData, is_repeated: "yes" },
        expected: { success: false, error: "\"is_repeated\" must be a boolean" },
    },
    {
        title: "❌ Lỗi: is_completed không phải boolean",
        input: { ...validBudgetData, is_completed: "no" },
        expected: { success: false, error: "\"is_completed\" must be a boolean" },
    },                   
];
const updateBudgetTestCases = [
    {
        title: "✅ Cập nhật ngân sách hợp lệ",
        budgetId: "valid_budget_id",
        input: { amount: 2000, startDate: "2025-02-01", dueDate: "2025-12-31" },
        expected: { success: true },
    },
    {
        title: "❌ Cập nhật thất bại - Budget không tồn tại",
        budgetId: "invalid_budget_id", // 🔥 Đây là lỗi cần test
        input: { amount: 2000 },
        expected: { success: false, error: "\"value\" failed custom validation because" },
    },
    // Amount
    {
        title: "❌ Lỗi: Amount không phải số",
        budgetId: "valid_budget_id",
        input: { amount: "not_a_number" },
        expected: { success: false, error: "Amount must be a number" },
    },
    {
        title: "❌ Lỗi: Amount không được âm",
        budgetId: "valid_budget_id",
        input: { amount: -500 },
        expected: { success: false, error: "Amount must be at least 0" },
    },
    // Dates
    {
        title: "❌ Lỗi: Ngày bắt đầu lớn hơn ngày kết thúc",
        budgetId: "valid_budget_id",
        input: { startDate: "2025-12-31", dueDate: "2025-01-01" },
        expected: { success: false, error: "Start date must be before or equal to due date" },
    },
    {
        title: "❌ Lỗi: Sai định dạng startDate",
        budgetId: "valid_budget_id",
        input: { startDate: "31-12-2025" },
        expected: { success: false, error: "\"startDate\" must be a valid date" },
    },
    {
        title: "❌ Lỗi: Sai định dạng dueDate",
        budgetId: "valid_budget_id",
        input: { dueDate: "2025-31-12" },
        expected: { success: false, error: "\"dueDate\" must be a valid date" },
    },
    // repeat_type
    {
        title: "❌ Lỗi: repeat_type không hợp lệ",
        budgetId: "valid_budget_id",
        input: { repeat_type: "daily" },
        expected: { success: false, error: "\"repeat_type\" must be one of [monthly, weekly, yearly, custom]" },
    },
    {
        title: "❌ Lỗi: is_repeated không phải boolean",
        budgetId: "valid_budget_id",
        input: { is_repeated: "yes" },
        expected: { success: false, error: "\"is_repeated\" must be a boolean" },
    },
    {
        title: "❌ Lỗi: is_completed không phải boolean",
        budgetId: "valid_budget_id",
        input: { is_completed: "no" },
        expected: { success: false, error: "\"is_completed\" must be a boolean" },
    },
];

module.exports = { createBudgetTestCases, updateBudgetTestCases };
