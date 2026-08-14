const Budget = require("../models/Budget");
const Expense = require("../models/Expense");

exports.createExpense = (req,res) => {

    const {
        budgetId,
        description,
        category,
        amount
    } = req.body;

    const budget =
        Budget.findById(budgetId);

    if(!budget){

        return res.status(404)
        .json({
            error:
            "Orçamento não encontrado"
        });

    }

    const expense =
        Expense.create(
            Number(budgetId),
            description,
            category || "Outros",
            Number(amount)
        );

    res.status(201).json(expense);
};

exports.getExpenses = (req,res) => {

    if(req.query.budgetId){

        return res.json(
            Expense.findByBudgetId(
                req.query.budgetId
            )
        );

    }

    return res.json(
        Expense.findAll()
    );
};

exports.deleteExpense = (req,res) => {

    const success =
        Expense.delete(
            req.params.id
        );

    if(!success){

        return res.status(404).json({
            error:
            "Despesa não encontrada"
        });

    }

    res.json({
        message:
        "Despesa removida"
    });
};