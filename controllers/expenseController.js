const Budget = require("../models/Budget");
const Expense = require("../models/Expense");

exports.createExpense = async (req, res) => {
  try {
    const { budgetId, description, category, amount } = req.body;

    const budget = await Budget.findById(budgetId);

    if (!budget) {
      return res.status(404).json({
        error: "Orçamento não encontrado",
      });
    }

    const expense = await Expense.create({
      budgetId,

      description,

      category: category || "Outros",

      amount: Number(amount),
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erro ao criar despesa",
    });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    if (req.query.budgetId) {
      const expenses = await Expense.find({
        budgetId: req.query.budgetId,
      });

      return res.json(expenses);
    }

    const expenses = await Expense.find();

    res.json(expenses);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erro ao listar despesas",
    });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({
        error: "Despesa não encontrada",
      });
    }

    res.json({
      message: "Despesa removida",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erro ao remover despesa",
    });
  }
};
