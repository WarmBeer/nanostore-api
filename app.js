require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.json());

const port = process.env.PORT || 80;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});

//REGISTER ROUTES
require('./resources/products')(app);
require('./resources/authentication')(app);
require('./resources/orders')(app);
