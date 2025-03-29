const { error } = require("firebase-functions/logger");
const { symbol } = require("joi");

const validWalletData = {
    symbol: "https://example.com/image.jpg",
    amount: 1000,
    currency_unit: "VND",
    wallet_name: "My Wallet",
    customer_id: "customer123",
};

const createWalletTestCases = [
    {
        title: "✅ Tạo ví hợp lệ",
        input: { ...validWalletData },
        expected: { success: true },
    },
    //Symbol
    {
        title: "❌ Lỗi: Symbol không phải URL hợp lệ",
        input: { ...validWalletData, symbol: "invalid-url" },
        expected: { success: false, error: "Symbol must be a valid image URL (jpg, png, gif, jpeg)" },
    },
    {
        title: "❌ Lỗi: Symbol không phải ảnh (jpg, png, gif, jpeg)",
        input: { ...validWalletData, symbol: "https://example.com/file.pdf" },
        expected: { success: false, error: "Symbol must be a valid image URL (jpg, png, gif, jpeg)" },
    },
    {
        title: "✅ Tạo ví hợp lệ khi thiếu symbol",
        input: { ...validWalletData, symbol: undefined },
        expected: { success: true },
    },
    //Amount
    {
        title: "❌ Lỗi: Amount không phải số",
        input: { ...validWalletData, amount: "not_a_number" },
        expected: { success: false, error: "Expected number, received string" },
    },
    {
        title: "❌ Lỗi: Amount không phải số âm",
        input: { ...validWalletData, amount: -10000 },
        expected: { success: false, error: "Amount must be a positive number" },
    },
    {
        title: "❌ Lỗi: Amount không chứa khoảng trắng",
        input: { ...validWalletData, amount: "100 000" },
        expected: { success: false, error: "Expected number, received string" },
    },
    {
        title: "❌ Tạo ví thất bại với amount là số dương rất lớn",
        input: { ...validWalletData, amount: 10000000000000000000 },
        expected: { success: false, error: "\"amount\" must be a safe number" },
    },
    {
        title: "❌ Lỗi: Thiếu amount",
        input: { ...validWalletData, amount: undefined },
        expected: { success: false, error: "amount is required" },
    },
    //Wallet name
    {
        title: "❌ Lỗi: Wallet name dưới 3 ký tự",
        input: { ...validWalletData, wallet_name: "ab" },
        expected: { success: false, error: "Wallet name must be at least 3 characters long" },
    },
    {
        title: "✅ Tạo ví với wallet_name có độ dài 3 ký tự",
        input: { ...validWalletData, wallet_name: "abc" },
        expected: { success: true },
    },
    {
        title: "✅ Tạo ví với wallet_name có độ dài 4 ký tự",
        input: { ...validWalletData, wallet_name: "abcd" },
        expected: { success: true },
    },
    {
        title: "✅ Tạo ví với wallet_name có độ dài 49 ký tự",
        input: { ...validWalletData, wallet_name: "a".repeat(49) },
        expected: { success: true },
    },
    {
        title: "✅ Tạo ví với wallet_name có độ dài 50 ký tự",
        input: { ...validWalletData, wallet_name: "a".repeat(50) },
        expected: { success: true },
    },
    {
        title: "✅ Tạo ví với wallet_name có khoảng trắng ở đầu",
        input: { ...validWalletData, wallet_name: " Momo" },
        expected: { success: true },
    },
    {
        title: "❌ Lỗi: Wallet name trên 50 ký tự",
        input: { ...validWalletData, wallet_name: "a".repeat(51) },
        expected: { success: false, error: "Wallet name must not exceed 50 characters" },
    },
    {
        title: "❌ Lỗi: Thiếu wallet name",
        input: { ...validWalletData, wallet_name: undefined },
        expected: { success: false, error: "wallet_name is required" },
    },
    {
        title: "❌ Lỗi: Thiếu customer_id",
        input: { ...validWalletData, customer_id: undefined },
        expected: { success: false, error: "customer_id is required" },
    },
];

const updateWalletTestCases = [
    {
        title: "✅ Cập nhật thành công - thay đổi tên ví",
        id: "valid_wallet_id",
        input: { wallet_name: "Updated Wallet" },
        expected: { success: true },
    },
    {
        title: "✅ Cập nhật thành công - thay đổi đơn vị tiền tệ",
        id: "valid_wallet_id",
        input: { currency_unit: "USD" },
        expected: { success: true },
    },
    {
        title: "✅ Cập nhật thành công - thay đổi số dư",
        id: "valid_wallet_id",
        input: { amount: 1000 },
        expected: { success: true },
    },
    {
        title: "❌ Cập nhật thất bại - Wallet không tồn tại",
        id: "invalid_wallet_id",
        input: { wallet_name: "New Name" },
        expected: { success: false, error: "Wallet not found" },
    },
    {
        title: "❌ Cập nhật thất bại - Số dư âm",
        id: "valid_wallet_id",
        input: { amount: -500 },
        expected: { success: false, error: "Amount must be a positive number" },
    },
    {
        title: "❌ Cập nhật thất bại - Đơn vị tiền tệ không hợp lệ",
        id: "valid_wallet_id",
        input: { currency_unit: "EUR" },
        expected: { success: false, error: "Currency must be either VND or USD" },
    },
];

const deleteWalletTestCases = [
    {
        title: "✅ Xóa ví thành công (có symbol, có budgets và transactions)",
        id: "wallet_with_data",
        mockWalletData: {
            _id: "wallet_with_data",
            wallet_name: "Test Wallet",
            currency_unit: "VND",
            amount: 1000,
            symbol: "https://example.com/image.jpg", // có symbol → cần xóa image
        },
        // Giả sử có 2 budget documents và 3 transaction documents
        mockBudgets: [
            { id: "budget1" },
            { id: "budget2" },
        ],
        mockTransactions: [
            { id: "txn1" },
            { id: "txn2" },
            { id: "txn3" },
        ],
        expected: { success: true },
    },
    {
        title: "✅ Xóa ví thành công (không có symbol, không có budgets, không có transactions)",
        id: "wallet_without_data",
        mockWalletData: {
            _id: "wallet_without_data",
            wallet_name: "Empty Wallet",
            currency_unit: "USD",
            amount: 500,
            symbol: undefined,
        },
        mockBudgets: [],
        mockTransactions: [],
        expected: { success: true },
    },
    {
        title: "❌ Xóa ví thất bại - ví không tồn tại",
        id: "non_existent_wallet",
        mockWalletData: null, // không có ví
        mockBudgets: [],
        mockTransactions: [],
        expected: { success: false, error: "Wallet not found" },
    },
];
module.exports = { createWalletTestCases, updateWalletTestCases, deleteWalletTestCases };