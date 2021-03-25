module.exports = function(app){

    const service = require('../services/authentication');

    app.post('/auth', (req, res) => {
        service.loginUser(req, res);
    });

}
