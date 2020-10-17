const mysql = require('mysql2');

/*
    Instead of opening a single connection everytime we want to send a query to the DB we can use Pool object 
    Pool object holds multiple connections active, and each time we query we are "consuming" one of them
    That way we can query multiple times without waiting time, and query multiple times simultinusly, but it is more resource-heavy methodology
*/
// We specifiy details regarding our DB + credentials 
// node-complete === the name we gave the DB schema
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node-complete',
    password: 'Aa123456'
});


// A promise is a version of callback
// You can combin it with the "then"/"catch" function to let the program know that it should wait for that execution to end
module.exports = pool.promise();