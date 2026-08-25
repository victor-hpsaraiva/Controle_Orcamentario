const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const ExpenseController =
    require("../controllers/expenseController");

router.post(
    "/",
    authMiddleware,
    ExpenseController.createExpense
);

router.get(
    "/",
    authMiddleware,
    ExpenseController.getExpenses
);

router.delete(
    "/:id",
    authMiddleware,
    ExpenseController.deleteExpense
);

module.exports = router;