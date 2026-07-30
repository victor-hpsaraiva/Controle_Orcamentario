const express = require("express");

const router = express.Router();

const budgetController =
require("../controllers/budgetController");

router.post(
    "/",
    budgetController.createBudget
);

router.get(
    "/",
    budgetController.getBudgets
);

router.get(
    "/:id",
    budgetController.getBudget
);

router.delete(
    "/:id",
    budgetController.deleteBudget
);

module.exports = router;