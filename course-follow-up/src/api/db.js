const mysql = require('mysql2');

// const connection = mysql.createConnection({
//     host: '127.0.0.1',
//     user: 'root',
//     password: '',
//     database: 'coursefollowup',
//     port: '3306'
// });
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'Barcelona01',
//     database: 'coursefollowup',
//     port: '3306'
// });

//Hosteo de base de datos en Railway
const connection = mysql.createConnection({
  host: 'monorail.proxy.rlwy.net',
  user: 'root',
  password: 'dARhAIEHrxfGrPPSoSvpzlCnqvdWvqQJ',
  database: 'railway',
  port: '27491'
});

const promiseConnection = connection.promise();

promiseConnection.connect()
  .then(() => console.log('Conexión exitosa a la base de datos'))
  .catch(err => console.error('Error al conectar a la base de datos:', err));

module.exports = promiseConnection;

/*connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});

module.exports = connection;*/