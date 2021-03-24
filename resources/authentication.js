module.exports = function(app){

    const service = require('../services/users');

    app.get('/auth', (req, res) => {
        service.loginUser(req, res);
    });

}
