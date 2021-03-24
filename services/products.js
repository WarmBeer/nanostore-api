const db = require('../db/connection');
const fetch = require('cross-fetch');

// Mongo DB Collections
const productsCollection = db.get('products');

function getProducts(req, res) {
    let response = {};
    productsCollection.find()
        .then((data) => {
            response = data;
        })
        .catch((error) => {
            console.error(error)
            response = "Error when fetching products."
        })
        .finally(() => {
            res.json(response);
        }) ;
}

module.exports = {
    getProducts,
}
