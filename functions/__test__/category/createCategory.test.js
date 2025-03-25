const { createCategorySchema } = require("../../src/validations/category.schema");
const { addCategory } = require("../../src/services/category.service");
const { addCategoryTestCases } = require("../data/categoryData"); 

describe("Unit Test - addCategory", () => {
    addCategoryTestCases.forEach(({ title, input, expected }) => {
    it(title, async () => {
      try {
        // Nếu không lỗi, gọi hàm tạo ví
        const result = await addCategory(input);

        // Nếu test kỳ vọng thất bại mà không lỗi -> sai
        if (!expected.success) {
          fail(`Expected error but got success: ${JSON.stringify(result)}`);
        }

        expect(result).toHaveProperty("symbol");
        expect(result).toHaveProperty("name");
        expect(result).toHaveProperty("parent_id");
        expect(result).toHaveProperty("createdBy");
        expect(result).toHaveProperty("transaction_type");
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
