const Budget = require("../models/Budget");
const Expense = require("../models/Expense");

const ALERT_PERCENTAGE = 10;

function calculateBudgetStatus(budget){

    const budgetExpenses =
        Expense.findByBudgetId(
            budget.id
        );

    const totalSpent =
        budgetExpenses.reduce(
            (sum,item) =>
            sum + item.amount,
            0
        );

    const remaining =
        budget.amount - totalSpent;

    const alertLimit =
        budget.amount *
        (ALERT_PERCENTAGE / 100);

    return {

        ...budget,

        totalSpent,

        remaining,

        percentageUsed:
            (
                totalSpent /
                budget.amount
            ) * 100,

        status:
            remaining < 0
            ? "negative"
            : remaining <= alertLimit
            ? "warning"
            : "ok"

    };
}

exports.createBudget = (req,res) => {

    const { name, amount } = req.body;

    if(!name || !amount){

        return res.status(400).json({
            error: "Name e Amount obrigatórios"
        });

    }

    const budget =
        Budget.create(
            name,
            Number(amount)
        );

    return res.status(201).json(
        calculateBudgetStatus(budget)
    );
};

exports.getBudgets = (req,res) => {

    const result =
        Budget.findAll()
        .map(calculateBudgetStatus);

    res.json(result);
};

exports.getBudget = (req,res) => {

    const budget =
        Budget.findById(
            req.params.id
        );

    if(!budget){

        return res.status(404).json({
            error: "Orçamento não encontrado"
        });

    }

    res.json(
        calculateBudgetStatus(budget)
    );
};

exports.deleteBudget = (req,res) => {

    const success =
        Budget.delete(req.params.id);

    if(!success){

        return res.status(404).json({
            error: "Orçamento não encontrado"
        });

    }

    res.json({
        message:
        "Orçamento removido"
    });
};