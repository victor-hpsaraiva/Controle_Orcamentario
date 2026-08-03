//REGISTRO 

const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;

        const exists = await User.findOne({
            email
        });

        if (exists) {

            return res.status(400).json({
                error: "Email já cadastrado"
            });

        }

        const user = await User.create({
            name,
            email,
            password
        });

        return res.status(201).json({
            message: "Usuário criado",
            user
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: "Erro ao cadastrar usuário"
        });

    }

};


//login 

exports.login = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        const user = await User.findOne({
            email
        });

        if (
            !user ||
            user.password !== password
        ) {

            return res.status(401).json({
                error: "Email ou senha inválidos"
            });

        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h"
            }
        );

        return res.json({
            message: "Login realizado",
            token,
            user
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: "Erro ao realizar login"
        });

    }

};