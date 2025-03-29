const { createCustomerSchema } = require("../../src/validations/customer.schema");
const { createNewCustomer } = require("../../src/services/customer.service");
const { createCustomerTestCases } = require("../data/customerData"); 

describe("Unit Test - createCustomer", () => {
    createCustomerTestCases.forEach(({ title, input, expected }) => {
    it(title, async () => {
      try {
        // Nếu không lỗi, gọi hàm tạo ví
        const result = await createNewCustomer(input);

        // Nếu test kỳ vọng thất bại mà không lỗi -> sai
        if (!expected.success) {
          fail(`Expected error but got success: ${JSON.stringify(result)}`);
        }

        expect(result).toHaveProperty("avatar");
        expect(result).toHaveProperty("full_name");
        expect(result).toHaveProperty("gender");
        expect(result).toHaveProperty("email");
        expect(result).toHaveProperty("provider");
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
