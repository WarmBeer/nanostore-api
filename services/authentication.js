const db = require('../db/connection');
const jwtHelper = require("../core/jwtHelper");
const users = db.get('users');

function loginUser(req, res) {
    const credentials = {
        email: req.params.email,
        _password: req.params.password
    }

    getUser(credentials.email, credentials._password)
        .then((user) => {
            if (user) {
                let token = jwtHelper.generateToken(user);
                res.redirect(`${process.env.CLIENT}/auth?token=${token}`);
            } else {
                res.json({
                    ok: false,
                    message: 'Wrong email and password combination.'
                })
            }
        })
}

function getUser(email, _password) {
    return users.findOne({ email, _password });
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
}
