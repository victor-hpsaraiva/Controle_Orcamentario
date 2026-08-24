const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  budgetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Budget",
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    default: "Outros",
  },

  amount: {
    type: Number,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Expense", ExpenseSchema);
