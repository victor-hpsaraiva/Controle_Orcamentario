
const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
    name:   { type: String, required: true, trim: true, },
    amount: { type: Number, required: true, min: 0,     },
  },
  
  {
    timestamps: true,
  });

module.exports = mongoose.model("Budget", budgetSchema);
