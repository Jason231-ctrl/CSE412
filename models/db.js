const Pool = require("pg").Pool;
const creds = require("../dbcreds");

const pool = new Pool({
    user: creds.user,
    password: creds.password,
    host: creds.host,
    port: creds.port,
    database: creds.database
})

module.exports = pool;