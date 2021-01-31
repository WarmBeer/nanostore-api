require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();

app.use(morgan('tiny'));
app.use(bodyParser.json());

const port = process.env.PORT || 80;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});

//REGISTER ROUTES
require('./resources/products')(app);
