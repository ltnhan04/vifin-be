const validCustomerData = {
    avatar: "https://example.com/avatar.jpg",
    full_name: "John Doe",
    gender: "male",
    email: "johndoe@gmail.com",
    uid: "user123",
    provider: "google",
    role: "customer",
}
const createCustomerTestCases = [
    {
        title: "✅ Tạo khách hàng với dữ liệu hợp lệ",
        input: { ...validCustomerData },
        expected: { success: true },
    },
    {
        title: "✅ Tạo khách hàng với avatar là undefined",
        input: { ...validCustomerData, avatar: undefined, },
        expected: { success: true },
    },
    {
        title: "✅ Tạo khách hàng không có giới tính (default: male)",
        input: { ...validCustomerData, gender: undefined },
        expected: { success: true },
    },
    {
        title: "✅ Tạo khách hàng không có provider",
        input: { ...validCustomerData, provider: null },
        expected: { success: true },
    },
    {
        title: "❌ Không thể tạo khách hàng thiếu full_name",
        input: { ...validCustomerData, full_name: undefined },
        expected: { success: false, error: '"full_name" is required' },
    },
    {
        title: "❌ Lỗi: full_name quá ngắn (< 2 ký tự)",
        input: { ...validCustomerData, full_name: "Ă" }, // 1 ký tự
        expected: { success: false, error: "full_name must be at least 2 characters" },
    },
    {
        title: "✅ Tạo danh mục với full_name có độ dài 2 ký tự",
        input: { ...validCustomerData, full_name: "ab" },
        expected: { success: true },
    },
    {
        title: "✅ Tạo danh mục với full_name có độ dài 3 ký tự",
        input: { ...validCustomerData, full_name: "abc" },
        expected: { success: true },
    },
    {
        title: "✅ Tạo danh mục với full_name có độ dài 49 ký tự",
        input: { ...validCustomerData, full_name: "a".repeat(49) },
        expected: { success: true },
    },
    {
        title: "✅ Tạo danh mục với full_name có độ dài 50 ký tự",
        input: { ...validCustomerData, full_name: "a".repeat(50) },
        expected: { success: true },
    },
    {
        title: "✅ Tạo danh mục với full_name có khoảng trắng ở đầu",
        input: { ...validCustomerData, full_name: " Momo" },
        expected: { success: true },
    },
    {
        title: "❌ Lỗi: full_name quá dài (> 50 ký tự)",
        input: { ...validCustomerData, full_name: "A".repeat(51) }, // 51 ký tự
        expected: { success: false, error: "full_name must be at most 50 characters" },
    },
    {
        title: "❌ Không thể tạo khách hàng thiếu email",
        input: { ...validCustomerData, email: undefined },
        expected: { success: false, error: '"email" is required' },
    },
    {
        title: "❌ Lỗi: email không đúng định dạng(thiếu @)",
        input: { ...validCustomerData, email: "testAtgmail.com" },
        expected: { success: false, error: 'Email must be a valid Gmail address (@gmail.com)' },
    },
    {
        title: "❌ Lỗi: email không đúng định dạng(thiếu .)",
        input: { ...validCustomerData, email: "test@gmailcom" },
        expected: { success: false, error: 'Email must be a valid Gmail address (@gmail.com)' },
    },
    {
        title: "❌ Lỗi: email không đúng định dạng(thiếu .com)",
        input: { ...validCustomerData, email: "test@gmail" },
        expected: { success: false, error: 'Email must be a valid Gmail address (@gmail.com)' },
    },
    {
        title: "❌ Lỗi: gender không hợp lệ",
        input: { ...validCustomerData, gender: "gay" }, // Không hợp lệ
        expected: { success: false, error: "\"gender\" must be one of [male, female]" },
    },
    {
        title: "❌ Không thể tạo khách hàng với provider không hợp lệ",
        input: { ...validCustomerData, provider: "unknown" },
        expected: { success: false, error: "\"provider\" must be one of [google, null]" },
    },
];

module.exports = { createCustomerTestCases };

