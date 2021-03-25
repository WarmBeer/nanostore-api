const jwtHelper = require("../../core/jwtHelper");

const defaultResponse = {
    error: 'Unauthorized.'
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
            res.status(401).json(defaultResponse);
        }

        if (!err) {
            next();
        }
    } else {
        res.status(401).json(defaultResponse);
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
            res.status(401).json(defaultResponse);
        }

        if (!err) {
            if (req.user.role >= 2) {
                next();
            } else {
                res.status(401).json(defaultResponse);
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
