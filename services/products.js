const db = require('../db/connection');
const fetch = require('cross-fetch');

// Mongo DB Collections
const products_db = db.get('products');

function getProducts(req, res) {
    res.send('Hello!');
}

module.exports = {
    getProducts,
}
