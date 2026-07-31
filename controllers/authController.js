const User = require("../models/User");
const jwt = require("jsonwebtoken");s

exports.register = (req,res) => {

    const {
        name,
        email,
        password
    } = req.body;

    const exists =
        User.findByEmail(email);

    if(exists){

        return res.status(400).json({
            error:"Email já cadastrado"
        });

    }

    const user =
        User.create(
            name,
            email,
            password
        );

    res.status(201).json({
        message:"Usuário criado",
        user
    });
};

exports.login = (req,res) => {

    const {
        email,
        password
    } = req.body;

    const user =
        User.findByEmail(email);

    if(
        !user ||
        user.password !== password
    ){

        return res.status(401).json({
            error:"Email ou senha inválidos"
        });

    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"24h"
        }
    );

    res.json({
        message:"Login realizado",
        token,
        user
    });
};