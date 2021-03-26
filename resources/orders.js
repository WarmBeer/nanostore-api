module.exports = function(app){

    const authenticate = require("./middlewares/authenticate");
    const service = require('../services/orders');

    app.get('/order/:orderId', authenticate.user, (req, res) => {
        service.getOrderById(req, res);
    });

    app.post('/order', authenticate.user, (req, res) => {
        service.purchase(req, res);
    });

}
