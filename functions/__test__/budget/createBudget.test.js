const { createBudget } = require("../../src/services/budget.service"); // Giả sử bạn có service xử lý logic
const { createBudgetTestCases } = require("../data/budgetData"); // File chứa test case

describe("Unit Test - createBudget", () => {
    createBudgetTestCases.forEach(({ title, input, expected }) => {
        it(title, async () => {
            try {
                // Nếu không lỗi, gọi hàm tạo ví
                const result = await createBudget(input);

                // Nếu test kỳ vọng thất bại mà không lỗi -> sai
                if (!expected.success) {
                    fail(`Expected error but got success: ${JSON.stringify(result)}`);
                }

                expect(result).toHaveProperty("category_id");
                expect(result).toHaveProperty("wallet_id");
                expect(result).toHaveProperty("amount");
                expect(result).toHaveProperty("repeat_type");
                expect(result).toHaveProperty("is_repeated");
                expect(result).toHaveProperty("createdAt");
                expect(result).toHaveProperty("updatedAt"); 
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