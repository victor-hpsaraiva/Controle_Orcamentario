const express = require("express");
const router = express.Router();

// ------------------------------------------------------

const LoginController = require("../controllers/ControlLogin");



// ------------------------------------------------------

router.post("/", LoginController.Compare);




