// tests/wallet/delete.test.js

// Mock module firebase.config với đúng cấu trúc export
jest.mock("../../src/configs/firebase.config", () => {
    return {
      db: {
        collection: jest.fn(),
      },
    };
  });
  
  // Mock module storage
  jest.mock("../../src/utils/upload", () => {
    return {
      deleteImageFromStorage: jest.fn().mockResolvedValue(),
    };
  });
  
  const { db } = require("../../src/configs/firebase.config");
  const { deleteImageFromStorage } = require("../../src/utils/upload");
  const WalletService = require("../../src/services/wallet.service");
  const { deleteWalletTestCases } = require("../data/walletData");
  
  // Giả lập đối tượng document cho Firestore
  const fakeDoc = (id) => ({
    id,
    delete: jest.fn().mockResolvedValue(),
  });
  
  // Giả lập query snapshot
  const fakeQuerySnapshot = (docsData) => ({
    docs: docsData.map((doc) => ({
      id: doc.id,
      delete: jest.fn().mockResolvedValue(),
    })),
  });
  
  // Biến toàn cục để lưu test case hiện tại (để mock budgets và transactions)
  let currentDeleteWalletTest = null;
  
  // Mock getWallet của WalletService
  jest.spyOn(WalletService, "getWallet").mockImplementation((id) => {
    const testCase = deleteWalletTestCases.find((tc) => tc.id === id);
    return Promise.resolve(testCase ? testCase.mockWalletData : null);
  });
  
  // Mock db.collection cho các collection: wallets, budgets, transactions
  db.collection.mockImplementation((collectionName) => {
    if (collectionName === "wallets") {
      return {
        doc: (id) => fakeDoc(id),
      };
    }
    if (collectionName === "budgets" || collectionName === "transactions") {
      return {
        where: () => ({
          get: () => {
            if (!currentDeleteWalletTest) return Promise.resolve({ docs: [] });
            const data =
              collectionName === "budgets"
                ? currentDeleteWalletTest.mockBudgets
                : currentDeleteWalletTest.mockTransactions;
            return Promise.resolve(fakeQuerySnapshot(data));
          },
        }),
        doc: (id) => fakeDoc(id),
      };
    }
    return {};
  });
  
  describe("Unit Test - deleteWallet", () => {
    deleteWalletTestCases.forEach(({ title, id, expected, mockWalletData }) => {
      it(title, async () => {
        currentDeleteWalletTest = deleteWalletTestCases.find((tc) => tc.id === id);
        try {
          const result = await WalletService.deleteWallet(id);
          if (!expected.success) {
            throw new Error(`Expected error but got success: ${JSON.stringify(result)}`);
          }
          // Kiểm tra kết quả trả về: walletData trước khi xóa
          expect(result).toEqual(mockWalletData);
          // Nếu ví có symbol, kiểm tra deleteImageFromStorage đã được gọi
          if (mockWalletData && mockWalletData.symbol) {
            expect(deleteImageFromStorage).toHaveBeenCalledWith(mockWalletData.symbol);
          }
        } catch (error) {
          if (expected.success) {
            throw new Error(`Expected success but got error: ${error.message}`);
          } else {
            expect(error.message).toContain(expected.error);
          }
        }
      });
    });
  });
  