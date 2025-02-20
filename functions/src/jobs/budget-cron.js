const cron = require("node-cron");
const BudgetService = require("../services/budget.service");

cron.schedule("0 0 * * *", async () => {
  try {
    const budgets = await BudgetService.getBudgets();
    for (const budget of budgets) {
      const isCompleted = await BudgetService.checkBudgetCompletion(budget);
      if (budget.is_repeated && isCompleted) {
        await BudgetService.handleRepeatBudget(budget);
      }
    }
    console.log("Check budget auto repeat completed");
  } catch (error) {
    console.error(error);
  }
});
