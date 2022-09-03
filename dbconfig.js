const pool = require("pg").Pool;

const dbPool = new pool({
    user:"postgres",
    host:"127.0.0.1",
    database:"shorturl",
    password:"jmk161651",
    port:5432
});
module.exports = dbPool;