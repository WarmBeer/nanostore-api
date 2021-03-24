const jwtHelper = require('../../core/jwtHelper');
const db = require('../../db/connection');
const { userRoles } = require('../../core/helpers');

const defaultResponse = {
    ok: false,
    message: 'Unauthorized.'
};

function user(req, res, next) {
    const authHeader = req.header('authorization');

    if (authHeader != null && authHeader.startsWith("Bearer ")) {
        // get token from the authentication header
        const token = authHeader.substring(7, authHeader.length);
        let err = false;

        try {
            // check if token is a valid user
            req.user = jwtHelper.verifyToken(token);
        } catch {
            err = true;
            console.log('Token invalid.');
            res.json(defaultResponse);
        }

        if (!err) {
            next();
        }
    } else {
        res.json(defaultResponse);
    }
}

function admin(req, res, next) {
    const authHeader = req.header('authorization');

    if (authHeader != null && authHeader.startsWith("Bearer ")) {
        // get token from the authentication header
        const token = authHeader.substring(7, authHeader.length);
        let err = false;

        try {
            // check if token is a valid user
            req.user = jwtHelper.verifyToken(token);
        } catch {
            err = true;
            console.log('Token invalid.');
            res.json(defaultResponse);
        }

        if (!err) {
            if (req.user.role >= userRoles.MOD) {
                next();
            } else {
                res.json(defaultResponse);
            }
        }

    } else {
        res.json(defaultResponse);
    }
}

module.exports = {
    user,
    admin,
}
