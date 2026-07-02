require('dotenv').config();

const LoginModel = require("../models/LoginModel");
const bcrypt = require('bcrypt');

exports.create = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: "Nome, email e senha são obrigatórios." });
  }

  try {
    const salt = await bcrypt.genSalt(12);
    const senhaHash = await bcrypt.hash(senha, salt);
    const newConta = new LoginModel({ nome, email, senhaHash });
    await newConta.save();
    res.status(201).json(newConta);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar conta" });
  }
};

exports.compara = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Email e senha são obrigatórios." });
  }

  try {
    const usuario = await LoginModel.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ erro: "Usuário não encontrado" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
    if (!senhaValida) {
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    res.json({ mensagem: "Login OK!", usuario: usuario.nome });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao processar login" });
  }
};