const express = require("express");

const router = express.Router();

const ExpenseController = require("../controllers/expenseController");

router.post("/", ExpenseController.createExpense);

router.get("/", ExpenseController.getExpenses);

router.delete("/:id", ExpenseController.deleteExpense);

module.exports = router;
