const monk = require('monk');

const uri = 'mongodb://45.55.61.121:26076/nanostore';

const db = monk(uri, function(err, db){
    if(err){
        console.warn("Db is not connected.", err.message);
    } else {
        console.info('Successfully connected to database.')
    }
});

module.exports = db;
