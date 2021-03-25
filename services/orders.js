const db = require('../db/connection');
const sanitize = require("mongo-sanitize");

// Mongo DB Collections
const productsCollection = db.get('products');
const ordersCollection = db.get('orders');

function purchase(req, res) {
    console.log(req.body);

    if (!req.body.orders) { res.status(400).json({ error: 'Missing arguments.' }) }

    stockCheck(req.body.orders)
        .then(
            success => {
                console.log('All items in stock.');
            },
            fail => {
                console.log(fail);
            }
        )

    //TODO: Filter input
    const order_info = {
        email: req.user.email,
        name: req.user.name,
        products: {}
    }

    /*
    createUser(user_info.email, user_info._password, user_info.name, user_info.role)
        .then((user) => {
            if (user) {
                let token = jwtHelper.generateToken(user);
                res.json({
                    user,
                    token
                });
            } else {
                res.status(501).json({
                    error: 'Error when registering user.'
                })
            }
        })
        .catch((e) => {
            console.error(e);
            res.status(400).json({
                error: 'Illegal arguments or Email already in use.'
            })
        })
     */
}

function stockCheck(orders) {
    return new Promise((resolve, reject) => {
        orders.forEach((order) => {
            if (!order.productId) reject('Wrong order format.');
            if (order.quantity < 1) reject('Quantity needs to be at least 1.')

            const order_info = {
                id: order.productId
            }

            sanitize(order_info);

            productsCollection.findOne(order_info)
                .then((product) => {
                    if (!product) reject('Product does not exist.');
                    if (product.stock < order.quantity) {
                        reject('Some items are out of stock.');
                    }
                })
                .catch((e) => {
                    console.error(e);
                    reject('Wrong order format.');
                })
        });

        resolve(true);
    })
}

module.exports = {
    purchase,
}
