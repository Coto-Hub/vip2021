let db = require('../configDb');
let Cryptr = require('cryptr');

db.connect(function(err) {
    if (err) throw err;
});

module.exports.getConnexionValide = async function(login, password) {
    let cryptr = new Cryptr('MaSuperCléDeChiffrementDeouF');
    let sql = `select passwd from parametres where login = "${login}"`;
    return db.promise().execute(sql).then(([rows]) => {
        if (rows[0] !== undefined) {
            return cryptr.decrypt(rows[0].passwd) === password;
        }
        return false;
    });
}
