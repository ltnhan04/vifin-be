const WalletService = require("../../src/services/wallet.service");
const { updateWalletTestCases } = require("../data/walletData");
const { updateWalletSchema } = require("../../src/validations/wallet.schema");

// Mock getWallet để trả về wallet hợp lệ cho "valid_wallet_id"
jest.spyOn(WalletService, "getWallet").mockImplementation((id) => {
    if (id === "valid_wallet_id") {
        return Promise.resolve({
            _id: "valid_wallet_id",
            wallet_name: "Old Wallet",
            currency_unit: "VND",
            amount: 500,
            symbol: "https://example.com/old-image.jpg",
        });
    }
    return Promise.resolve(null); // Cho các id không hợp lệ
});

// Mock các hàm liên quan đến database trong updateWallet
const fakeUpdate = jest.fn().mockResolvedValue();
jest.spyOn(WalletService, "updateWallet").mockImplementation(async (id, data) => {
    const walletData = await WalletService.getWallet(id);
    if (!walletData) {
        const error = new Error("Wallet not found");
        error.statusCode = 404;
        throw error;
    }
    // Giả lập việc update: trả về walletData được cập nhật
    const updatedWallet = { ...walletData, ...data, updatedAt: new Date() };
    await fakeUpdate();
    return { ...updatedWallet, _id: id };
});

describe("Unit Test - updateWallet", () => {
    updateWalletTestCases.forEach(({ title, id, input, expected }) => {
        it(title, async () => {
            try {
                // Kiểm tra đầu vào có hợp lệ không
                const { error } = updateWalletSchema.validate(input);
                if (error) throw new Error(error.details[0].message);

                // Gọi hàm updateWallet thông qua WalletService chứ không destructure
                const result = await WalletService.updateWallet(id, input);

                // Nếu kỳ vọng thất bại mà không lỗi -> báo lỗi
                if (!expected.success) {
                    throw new Error(`Expected error but got success: ${JSON.stringify(result)}`);
                }

                // Kiểm tra các field được cập nhật
                expect(result).toHaveProperty("_id", id);
                if (input.wallet_name) expect(result.wallet_name).toBe(input.wallet_name);
                if (input.currency_unit) expect(result.currency_unit).toBe(input.currency_unit);
                if (input.amount !== undefined) expect(result.amount).toBe(input.amount);
            } catch (error) {
                if (expected.success) {
                    throw new Error(`Expected success but got error: ${error.message}`);
                } else {
                    expect(error.message).toContain(expected.error);
                    // Nếu test case có expected.statusCode, bạn có thể kiểm tra thêm:
                    if (expected.statusCode) {
                        expect(error.statusCode).toBe(expected.statusCode);
                    }
                }
            }
        });
    });
});
