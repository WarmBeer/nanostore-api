const fetch = require('cross-fetch');

function getProducts(req, res) {
    res.send('Hello!');
}

module.exports = {
    getProducts,
};
