const Budget = require("../models/Budget");
const Expense = require("../models/Expense");

const ALERT_PERCENTAGE = 10;

async function calculateBudgetStatus(budget) {
  const budgetExpenses = await Expense.find({
    budgetId: budget._id,
  });

  const totalSpent = budgetExpenses.reduce((sum, item) => sum + item.amount, 0);

  const remaining = budget.amount - totalSpent;

  const alertLimit = budget.amount * (ALERT_PERCENTAGE / 100);

  return {
    id: budget._id,

    name: budget.name,

    amount: budget.amount,

    createdAt: budget.createdAt,

    totalSpent,

    remaining,

    percentageUsed: budget.amount > 0 ? (totalSpent / budget.amount) * 100 : 0,

    status:
      remaining < 0 ? "negative" : remaining <= alertLimit ? "warning" : "ok",
  };
}

exports.createBudget = async (req, res) => {
  try {
    const { name, amount } = req.body;

    if (!name || !amount) {
      return res.status(400).json({
        error: "Nome e valor obrigatórios",
      });
    }

    const budget = await Budget.create({
      name,

      amount: Number(amount),
    });

    res.status(201).json(await calculateBudgetStatus(budget));
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erro ao criar orçamento",
    });
  }
};

exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find();

    const result = await Promise.all(budgets.map(calculateBudgetStatus));

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erro ao listar orçamentos",
    });
  }
};

exports.getBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({
        error: "Orçamento não encontrado",
      });
    }

    res.json(await calculateBudgetStatus(budget));
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erro ao buscar orçamento",
    });
  }
};

exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findByIdAndDelete(req.params.id);

    if (!budget) {
      return res.status(404).json({
        error: "Orçamento não encontrado",
      });
    }

    await Expense.deleteMany({
      budgetId: budget._id,
    });

    res.json({
      message: "Orçamento removido",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erro ao remover orçamento",
    });
  }
};
