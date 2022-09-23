// # constantes
const path = require('path')
require('dotenv').config({path : path.join(__dirname ,"..",".env")});
const mysql = require('mysql2');
const colors = require('colors')

const pool = mysql.createPool({
    host : process.env.DB_HOST,
    port : process.env.DB_PORT,
    user : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE
})

pool.query('show tables' , (err ,rows ,fields)=> {
    if (err) throw err;
    console.log('Test::'.green.grey.bold ,'connection réussi');
});


module.exports = pool.promise();