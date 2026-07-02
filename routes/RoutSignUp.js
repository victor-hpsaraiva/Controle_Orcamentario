const express = require("express");
const router = express.Router();

// ------------------------------------------------------

const SignUpController = require("../controllers/ControlSignUp");



// ------------------------------------------------------

// Cria a conta no banco de dados
router.post("/", SignUpController.Create);