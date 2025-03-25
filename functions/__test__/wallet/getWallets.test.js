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
  
  describe("Unit Test - getWallets", () => {
    it("should return a list of wallets", async () => {
      // Giả lập 2 document trong collection "wallets"
      const fakeDocSnap1 = {
        id: "wallet1",
        data: () => ({ wallet_name: "Wallet 1", amount: 1000 }),
      };
      const fakeDocSnap2 = {
        id: "wallet2",
        data: () => ({ wallet_name: "Wallet 2", amount: 2000 }),
      };
  
      // Giả lập QuerySnapshot với phương thức forEach
      const fakeQuerySnap = {
        forEach: (callback) => {
          callback(fakeDocSnap1);
          callback(fakeDocSnap2);
        },
      };
  
      // Cấu hình mock cho db.collection("wallets").get()
      db.collection.mockImplementation((collectionName) => {
        if (collectionName === "wallets") {
          return {
            get: jest.fn().mockResolvedValue(fakeQuerySnap),
          };
        }
        return {};
      });
  
      const wallets = await WalletService.getWallets();
      expect(wallets).toEqual([
        { wallet_name: "Wallet 1", amount: 1000, _id: "wallet1" },
        { wallet_name: "Wallet 2", amount: 2000, _id: "wallet2" },
      ]);
    });
  
    it("should return an empty list when there are no wallets", async () => {
      // Giả lập QuerySnapshot không chứa document nào
      const fakeQuerySnap = {
        forEach: (callback) => {
          // Không có doc nào gọi callback
        },
      };
  
      db.collection.mockImplementation((collectionName) => {
        if (collectionName === "wallets") {
          return {
            get: jest.fn().mockResolvedValue(fakeQuerySnap),
          };
        }
        return {};
      });
  
      const wallets = await WalletService.getWallets();
      expect(wallets).toEqual([]);
    });
  });
  