const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const budgetController =
    require("../controllers/budgetController");

router.post(
    "/",
    authMiddleware,
    budgetController.createBudget
);

router.get(
    "/",
    authMiddleware,
    budgetController.getBudgets
);

router.get(
    "/:id",
    authMiddleware,
    budgetController.getBudget
);

router.delete(
    "/:id",
    authMiddleware,
    budgetController.deleteBudget
);

module.exports = router;