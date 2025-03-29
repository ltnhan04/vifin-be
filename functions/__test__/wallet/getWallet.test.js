// Đảm bảo jest.mock được gọi trước khi require WalletService
jest.mock("../../src/configs/firebase.config", () => {
    return {
      db: {
        collection: jest.fn(),
      },
    };
  });
  
  const { db } = require("../../src/configs/firebase.config");
  const WalletService = require("../../src/services/wallet.service");
  
  describe("Unit Test - getWallet", () => {
    it("should return wallet data if wallet exists", async () => {
      // Giả lập DocumentSnapshot khi ví tồn tại
      const fakeDocSnap = {
        exists: true,
        data: () => ({ wallet_name: "Wallet 1", amount: 1000 }),
      };
  
      // Cấu hình mock cho db.collection("wallets").doc(id).get()
      db.collection.mockImplementation((collectionName) => {
        if (collectionName === "wallets") {
          return {
            doc: (id) => ({
              get: jest.fn().mockResolvedValue(fakeDocSnap),
            }),
          };
        }
        return {};
      });
  
      const wallet = await WalletService.getWallet("wallet1");
      expect(wallet).toEqual({ wallet_name: "Wallet 1", amount: 1000 });
    });
  
    it("should throw an error if wallet does not exist", async () => {
      // Giả lập DocumentSnapshot khi ví không tồn tại
      const fakeDocSnap = {
        exists: false,
      };
  
      db.collection.mockImplementation((collectionName) => {
        if (collectionName === "wallets") {
          return {
            doc: (id) => ({
              get: jest.fn().mockResolvedValue(fakeDocSnap),
            }),
          };
        }
        return {};
      });
  
      // Dùng cách expect(...).rejects để kiểm tra lỗi
      await expect(WalletService.getWallet("nonexistent")).rejects.toThrow("Wallet not found");
    });
  });
  