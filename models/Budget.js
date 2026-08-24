const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports =
    mongoose.model(
        "Budget",
        BudgetSchema
    );