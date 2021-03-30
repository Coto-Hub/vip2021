/*
* config.Db contient les parametres de connection à la base de données
* Il utilise le module mysql
* il va créer aussi un pool de connexions utilisables
* la méthode getConnection permet de se connecter à MySQL
*
*/

const mysql = require('mysql2');
module.exports = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'vip2021',
    port : "3306"
});

