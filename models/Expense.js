const expenses = [];

let nextExpenseId = 1;

module.exports = {
  expenses,

  create(budgetId, description, category, amount) {
    const expense = {
      id: nextExpenseId++,
      budgetId,
      description,
      category,
      amount,
      createdAt: new Date().toISOString(),
    };

    expenses.push(expense);

    return expense;
  },

  findAll() {
    return expenses;
  },

  findByBudgetId(budgetId) {
    return expenses.filter((expense) => expense.budgetId === Number(budgetId));
  },

  findById(id) {
    return expenses.find((expense) => expense.id === Number(id));
  },

  delete(id) {
    const index = expenses.findIndex((expense) => expense.id === Number(id));

    if (index === -1) return false;

    expenses.splice(index, 1);

    return true;
  },
};
