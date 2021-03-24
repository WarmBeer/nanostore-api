const monk = require('monk');

const url = process.env.DB_URL;

const db = monk(url, function(err, db){
    if(err){
        console.warn("Db is not connected.", err.message);
    } else {
        console.info('Successfully connected to database.')
    }
});

module.exports = db;
