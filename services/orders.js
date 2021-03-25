const db = require('../db/connection');
const sanitize = require("mongo-sanitize");

// Mongo DB Collections
const productsCollection = db.get('products');
const ordersCollection = db.get('orders');

async function purchase(req, res) {
    console.log(req.body);

    if (!req.body.orders) {
        res.status(400).json({error: 'Missing arguments.'})
    }

    await validateOrders(req.body.orders)
        .then(
            success => {
                console.log('Orders are valid.');
            },
            error => {
                console.log(error);
                res.status(400).json({ error })
            }
        )

    await checkStockOrders(req.body.orders)
        .then(
            success => {
                console.log('All items are in stock.');
            },
            error => {
                console.log(error);
                res.status(400).json({ error })
            }
        )

    // Remove order quantity from stock
    await updateStockOrders(req.body.orders, -1)
        .then(
            success => {
                console.log('Item stock updated.');
            },
            error => {
                console.log(error);
                res.status(400).json({ error })
            }
        )

    createOrder(req.user, req.body.orders)
        .then(
            data => {
                console.log('Order successfully handled.');
                res.json({
                    orderId: data.id
                })
            },
            error => {
                console.log(error);
                res.status(400).json({ error })
                // Re-add stock
                updateStockOrders(req.body.orders, 1);
            }
        )
}

function validateOrders(orders) {
    return new Promise((resolve, reject) => {
        orders.forEach((order) => {
            if (!order.productId) reject('Wrong order format.');
            if (order.quantity < 1) reject('Quantity needs to be at least 1.')
        });
        resolve(true);
    })
}

function checkStockOrders(orders) {
    return new Promise((resolve, reject) => {
        orders.forEach((order) => {
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

function updateStockOrders(orders, modifier = 1 || -1) {
    return new Promise((resolve, reject) => {
        orders.forEach((order) => {
            const order_info = {
                id: order.productId
            }

            sanitize(order_info);

            productsCollection.findOneAndUpdate(order_info, { $inc: { stock: modifier * order.quantity }})
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

function createOrder({ email, name }, orders) {
    const order_info = {
        id: generateOrderId(),
        email,
        name,
        time: +Date.now(),
        products: orders
    }

    sanitize(order_info);

    return ordersCollection.insert(order_info);
}

function generateOrderId() {
    let S4 = function() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+S4()+"-"+S4()+S4()+'-'+S4()+S4());
}

module.exports = {
    purchase,
}
