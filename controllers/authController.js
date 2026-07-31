const User =
require("../models/User");

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
            error:
            "Email já cadastrado"
        });

    }

    const user =
        User.create(
            name,
            email,
            password
        );

    res.status(201).json({
        message:
        "Usuário criado",
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
            error:
            "Email ou senha inválidos"
        });

    }

    res.json({
        message:
        "Login realizado",
        user
    });
};