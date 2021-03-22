const monk = require('monk');

const uri = 'mongodb://45.55.61.121:26076';

const db = monk(uri, function(err, db){
    if(err){
        console.error("Db is not connected.", err.message);
    } else {
        console.log('Successfully connected to database.')
    }
});

module.exports = db;
