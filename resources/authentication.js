module.exports = function(app){

    const authenticate = require("./middlewares/authenticate");
    const service = require('../services/authentication');

    app.post('/login', (req, res) => {
        service.loginUser(req, res);
    });

    app.post('/register', (req, res) => {
        service.registerUser(req, res);
    });

    app.get('/myuser', authenticate.user, (req, res) => {
        service.getUserFromJwt(req, res);
    });

}
