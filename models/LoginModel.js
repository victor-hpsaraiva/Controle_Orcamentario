const mongoose = require("mongoose");

const LoginSchema = new mongoose.Schema({
  nome:      { type: String, required: true },
  email:     { type: String, required: true },
  senhaHash: { type: String, required: true },

});

module.exports = mongoose.model("LoginModel", LoginSchema, "Login");