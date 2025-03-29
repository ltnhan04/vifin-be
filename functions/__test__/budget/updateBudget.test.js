const BudgetService = require("../../src/services/budget.service");
const { updateBudgetTestCases } = require("../data/budgetData");
const { updateBudgetSchema } = require("../../src/validations/budget.schema");

// Mock getBudget để trả về budget hợp lệ cho "valid_budget_id"
jest.spyOn(BudgetService, "getBudgetById").mockImplementation((id) => {
    if (id === "valid_budget_id") {
        return Promise.resolve({
            _id: "valid_budget_id",
            category_id: "category123",
            wallet_id: "wallet456",
            startDate: "2025-01-01",
            dueDate: "2025-12-31",
            amount: 1000,
            repeat_type: "monthly",
            is_repeated: true,
            is_completed: false,
        });
    }
    return Promise.resolve(null); // Cho các id không hợp lệ
});

// Mock các hàm liên quan đến database trong updatebudget
const fakeUpdate = jest.fn().mockResolvedValue();
jest.spyOn(BudgetService, "updateBudget").mockImplementation(async (id, data) => {
    const budgetData = await BudgetService.getBudgetById(id);
    if (!budgetData) {
        const error = new Error("Budget not found");
        error.statusCode = 404;
        throw error;
    }
    // Giả lập việc update: trả về budgetData được cập nhật
    const updatedbudget = { ...budgetData, ...data, updatedAt: new Date() };
    await fakeUpdate();
    return { ...updatedbudget, _id: id };
});

describe("Unit Test - updatebudget", () => {
    updateBudgetTestCases.forEach(({ title, budgetId, input, expected }) => {
        it(title, async () => {
            try {
                const { error } = updateBudgetSchema.validate(input);
                if (error) throw new Error(error.details[0].message);

                const result = await BudgetService.updateBudget(budgetId, input);

                if (!expected.success) {
                    throw new Error(`Expected error but got success: ${JSON.stringify(result)}`);
                }

                expect(result).toHaveProperty("_id", budgetId);
                if (input.category_id) expect(result.category_id).toBe(input.category_id);
                if (input.wallet_id) expect(result.wallet_id).toBe(input.wallet_id);
                if (input.amount) expect(result.amount).toBe(input.amount);
                if (input.startDate) expect(result.startDate).toBe(input.startDate);
                if (input.dueDate) expect(result.dueDate).toBe(input.dueDate);
                if (input.repeat_type) expect(result.repeat_type).toBe(input.repeat_type);
            } catch (error) {
                if (expected.success) {
                    throw new Error(`Expected success but got error: ${error.message}`);
                } else {
                    expect(error.message.toLowerCase()).toContain(expected.error.toLowerCase());
                    if (expected.statusCode) {
                        expect(error.statusCode).toBe(expected.statusCode);
                    }
                }
            }
        });
    });

});
