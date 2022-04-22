const Pool = require("pg").Pool;

const pool = new Pool({
    user: "jasonleong",
    password: "05100805",
    host: "localhost",
    port: 5432,
    database: "chessdb"
})

module.exports = pool;