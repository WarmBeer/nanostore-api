module.exports = function(app){

    const service = require('../services/products');

    app.get('/products', (req, res) => {
        service.getProducts(req, res);
    });

}
