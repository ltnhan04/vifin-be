const { createTransactionWithWalletUpdate } = require("../../src/services/transaction.service");
const { db } = require("../../src/configs/firebase.config");
const { addTransactionTestCases } = require("../data/transactionData");

describe("Unit Test - addTransaction", () => {
  beforeAll(async () => {
    console.log("Setting up test data...");

    // Tạo một wallet giả trong Firestore trước khi chạy test
    await db.collection("wallets").doc("wallet789").set({
      amount: 5000, // Số dư ban đầu
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("Test wallet created.");
  });

  afterAll(async () => {
    console.log("Cleaning up test data...");
    await db.collection("wallets").doc("wallet789").delete(); // Xóa wallet sau khi test
  });

  addTransactionTestCases.forEach(({ title, input, expected }) => {
    it(title, async () => {
      console.log(`\nRunning test: ${title}`);
      console.log("Input data:", input);

      try {
        const result = await createTransactionWithWalletUpdate(input);
        console.log("Transaction result:", result);

        if (!expected.success) {
          fail(`Expected error but got success: ${JSON.stringify(result)}`);
        }

        expect(result).toHaveProperty("amount", input.amount);
        expect(result).toHaveProperty("category_id", input.category_id);
        expect(result).toHaveProperty("customer_id", input.customer_id);
        expect(result).toHaveProperty("wallet_id", input.wallet_id);
        expect(result).toHaveProperty("transaction_type", input.transaction_type);
        expect(result).toHaveProperty("note", input.note !== undefined ? input.note : null);
      } catch (error) {
        console.error("Transaction error:", error);

        if (expected.success) {
          fail(`Expected success but got error: ${error.message}`);
        } else {
          expect(error.message).toContain(expected.error);
        }
      }
    });
  });
});
