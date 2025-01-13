const mysql = require('mysql2');
//gets the env module
const dotenv = require('dotenv');

//initializes env file
dotenv.config();

//database connection settings
const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.getConnection((error, connection) => {

  if(error){
    console.log(`Error connecting to database: ${error}`);
    return;
  };
  console.log(`Connection success!`);
  connection.release();
});

// connection()


module.exports = connection;