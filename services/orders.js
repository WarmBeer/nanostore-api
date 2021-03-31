const db = require('../db/connection');
const sanitize = require("mongo-sanitize");

// Mongo DB Collections
const productsCollection = db.get('products');
const ordersCollection = db.get('orders');

function getOrderById(req, res) {
    if (!req.params.orderId) {
        res.status(400).json({error: 'Missing arguments.'})
    }

    getOrder(req.params.orderId)
        .then(
            order => {
                res.json({
                    order
                })
            },
            error => {
                console.log(error);
                res.status(400).json({ error })
            }
        )
}

function getOrder(orderId) {
    return new Promise((resolve, reject) => {

        const order = {
            id: orderId
        }

        sanitize(order);

        ordersCollection.findOne(order)
            .then((order) => {
                if (!order) reject('Order does not exist.');
                resolve(order);
            })
            .catch((e) => {
                console.error(e);
                reject('Wrong orderId format.');
            })
    });
}

async function purchase(req, res) {
    console.log(req.body);

    if (!req.body.orders || req.body.orders.length < 1) {
        res.status(400).json({error: 'Order a minimum of 1 product.'})
    }

    let orders = req.body.orders;

    let validateOrders_error = false;
    await validateOrders(orders)
        .then(
            success => {
                console.log('Orders are valid.');
            },
            error => {
                console.log(error);
                res.status(400).json({ error })
                validateOrders_error = error;
            }
        )
    if (validateOrders_error) return;

    let checkStockAndAddPriceOrders_error = false;
    await checkStockAndAddPriceOrders(orders)
        .then(
            success => {
                console.log('All items are in stock.');
            },
            error => {
                console.log(error);
                res.status(400).json({ error })
                checkStockAndAddPriceOrders_error = error;
            }
        )
    if (checkStockAndAddPriceOrders_error) return;

    // Remove order quantity from stock
    let updateStockOrders_error = false;
    await updateStockOrders(orders, -1)
        .then(
            success => {
                console.log('Item stock updated.');
            },
            error => {
                console.log(error);
                res.status(400).json({ error })
                updateStockOrders_error = true;
            }
        )
    if (updateStockOrders_error) return;

    createOrder(req.user, orders)
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

function checkStockAndAddPriceOrders(orders) {
    return new Promise((resolve, reject) => {
        let stockCheckQueue = 0;
        let forEachEnded = false;
        orders.forEach((order, index) => {
            ++stockCheckQueue
            const product = {
                id: order.productId
            }

            sanitize(product);

            productsCollection.findOne(product)
                .then((product) => {
                    if (!product) reject('Product does not exist.');
                    if (!product.price) reject('Could not find product price.');
                    if (product.stock < order.quantity) {
                        reject('Some items are out of stock.');
                    }
                    orders[index].price = product.price;
                    console.log(orders[0]);
                    --stockCheckQueue
                    if (stockCheckQueue < 1 && forEachEnded) resolve(true);
                })
                .catch((e) => {
                    console.error(e);
                    reject('Wrong order format.');
                })
        });
        forEachEnded = true;
    })
}

function updateStockOrders(orders, modifier = 1 || -1) {
    return new Promise((resolve, reject) => {
        let stockCheckQueue = 0;
        let forEachEnded = false;
        orders.forEach((order) => {
            ++stockCheckQueue
            const order_info = {
                id: order.productId
            }

            sanitize(order_info);

            productsCollection.findOneAndUpdate(order_info, { $inc: { stock: modifier * order.quantity }})
                .then((product) => {
                    --stockCheckQueue
                    if (stockCheckQueue < 1 && forEachEnded) resolve(true);
                })
                .catch((e) => {
                    console.error(e);
                    reject('Wrong order format.');
                })
        });
        forEachEnded = true;
    })
}

function createOrder({ email, name }, orders) {

    let subtotal = 0;

    orders.forEach((order) => {
        subtotal += order.price * order.quantity;
    });

    const order_info = {
        id: generateOrderId(),
        paid: true,
        email,
        name,
        time: +Date.now(),
        products: orders,
        subtotal
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
    getOrderById
}
