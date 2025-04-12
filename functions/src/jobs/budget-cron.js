const cron = require("node-cron");
const BudgetService = require("../services/budget.service");
const WalletService = require("../services/wallet.service")

cron.schedule(
  "0 0 * * *",
  async () => {
    try {
      const budgets = await BudgetService.getBudgets();
      for (const budget of budgets) {
        const isCompleted = await BudgetService.checkBudgetCompletion(budget);
        const walletData = await WalletService.getWallet(budget.customer_id)
        if (budget.is_repeated && isCompleted) {
          await BudgetService.handleRepeatBudget(budget, walletData.customer_id);
        }
      }
      console.log("Check budget auto repeat completed");
    } catch (error) {
      console.error(error);
    }
  },
  {
    timezone: "Asia/Ho_Chi_Minh",
  }
);
