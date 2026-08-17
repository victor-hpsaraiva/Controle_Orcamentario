const budgets = [];

let nextBudgetId = 1;

module.exports = {
  budgets,

  create(name, amount) {
    const budget = {
      id: nextBudgetId++,
      name,
      amount,
      createdAt: new Date().toISOString(),
    };

    budgets.push(budget);

    return budget;
  },

  findAll() {
    return budgets;
  },

  findById(id) {
    return budgets.find((budget) => budget.id === Number(id));
  },

  delete(id) {
    const index = budgets.findIndex((budget) => budget.id === Number(id));

    if (index === -1) return false;

    budgets.splice(index, 1);

    return true;
  },
};
