const usuario = require('../models/loginModel');
 
const bcrypt = require('bcrypt');
 
const nodemailer = require('nodemailer'); // Biblioteca para envio de e-mails
 
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env
 
//Função para testar conexão
exports.conexao = (req, res) => {
  res.status(200).json({ msg: "Conexão Ok para Cadastro de Login!" });
};
 
// Função para cadastrar novo usuário
exports.cadastrar = async (req, res) => {
  const { nome, email, senha, confirsenha } = req.body;
  if (!nome || !email || !senha || !confirsenha) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
  }
 
  // create password
  const salt = await bcrypt.genSalt(12); // Gera um salt para criptografar a senha
  const senhaHash = await bcrypt.hash(senha, salt); // Cria um hash da senha usando o salt
 
  try {
    const novoUsuario = new usuario({ nome, email, senhaHash, confirsenha });
    await novoUsuario.save();
    res.status(201).json(novoUsuario);
 
 
    // Enviar e-mail de boas-vindas
    try {
 
      const transportador = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
 
      await transportador.sendMail({//função de envio de e-mail, após realizar o cadastro
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: "Bem-vindo!",
        text: `Olá ${nome}, obrigado por se registrar!!!!!!`,
        html: `<h2 style="color: red;">Olá ${nome},</h2><p>Obrigado por se registrar!!!!!!</p>`,
      });
 
    } catch (erro) {
     
      console.error("Erro ao enviar e-mail de boas-vindas:", erro.message);
     
    }
 
 
  } catch (error) {
    res.status(500).json({ erro: "Erroeeee ao criar usuário" });
  }
};
 
// Função para realizar o login do usuário
exports.login = async (req, res) => {
  const { email, senha } = req.body;
 
  if (!email || !senha) {
    return res.status(400).json({ erro: "E-mail e senha são obrigatórios" });
  }
 
  try {
    const user = await usuario.findOne({ email });
 
    if (!user) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    } else if (!await bcrypt.compare(senha, user.senhaHash)) {
      return res.status(401).json({ erro: "Senha incorreta" });
    } else {
      res.status(200).json({ msg: "Login bem-sucedido!" });
    }
 
  } catch (error) {
    res.status(500).json({ erro: "Erro ao processar login" });
  }
 
};