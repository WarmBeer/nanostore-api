const db = require('../db/connection');
const jwtHelper = require("../core/jwtHelper");
const sanitize = require('mongo-sanitize');
const users = db.get('users');

function loginUser(req, res) {
    console.log(req.body);

    //TODO: Filter input
    const credentials = {
        email: req.body.email,
        _password: req.body.password
    }

    sanitize(credentials);

    getUser(credentials.email, credentials._password)
        .then((user) => {
            if (user) {
                let token = jwtHelper.generateToken(user);
                res.json({
                    user,
                    token
                });
            } else {
                res.status(400).json({
                    error: 'Wrong email and password combination.'
                })
            }
        })
        .catch((e) => {
            console.error(e);
            res.status(400).json({
                error: 'Illegal arguments.'
            })
        })
}

function registerUser(req, res) {
    console.log(req.body);

    //TODO: Filter input
    const user_info = {
        email: req.body.email,
        _password: req.body.password,
        name: req.body.name,
        role: 1
    }

    sanitize(user_info);

    createUser(user_info.email, user_info._password, user_info.name, user_info.role)
        .then((user) => {
            if (user) {
                let token = jwtHelper.generateToken(user);
                res.json({
                    user,
                    token
                });
            } else {
                res.status(501).json({
                    error: 'Error when registering user.'
                })
            }
        })
        .catch((e) => {
            console.error(e);
            res.status(400).json({
                error: 'Illegal arguments or Email already in use.'
            })
        })
}

function getUserFromJwt(req, res) {
    res.json({
        user: req.user,
        token: req.body.token
    })
}

function getUser(email, _password) {
    return users.findOne({ email, _password }, { projection: { _id: 0, _password: 0 } });
}

function createUser(email, _password, name, role) {
    const user = {
        email,
        _password,
        name,
        role
    }

    return users.insert(user);
}

module.exports = {
    loginUser,
    registerUser,
    getUserFromJwt
}
