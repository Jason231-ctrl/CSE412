const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: process.env.PG_ROOT,
    host: "localhost",
    port: 5432,
    database: "ChessDB"
})

module.exports = pool;