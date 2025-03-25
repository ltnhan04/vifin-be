const { createWalletSchema } = require("../../src/validations/wallet.schema");
const { createWallet } = require("../../src/services/wallet.service"); // Đường dẫn giả định
const { createWalletTestCases } = require("../data/walletData"); 

describe("Unit Test - createWallet", () => {
    createWalletTestCases.forEach(({ title, input, expected }) => {
    it(title, async () => {
      try {
        // Nếu không lỗi, gọi hàm tạo ví
        const result = await createWallet(input);

        // Nếu test kỳ vọng thất bại mà không lỗi -> sai
        if (!expected.success) {
          fail(`Expected error but got success: ${JSON.stringify(result)}`);
        }

        expect(result).toHaveProperty("symbol");
        expect(result).toHaveProperty("wallet_name");
        expect(result).toHaveProperty("currency_unit");
        expect(result).toHaveProperty("customer_id");
        expect(result).toHaveProperty("amount");
      } catch (error) {
        // Kiểm tra lỗi có giống kỳ vọng không
        if (expected.success) {
          fail(`Expected success but got error: ${error.message}`);
        } else {
          expect(error.message).toContain(expected.error);
        }
      }
    });
  });
});
