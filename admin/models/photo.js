let db = require('../configDb');

db.connect(function(err) {
    if (err) throw err;
});

module.exports.getAllVip = function() {
    let sql = `select v.vip_numero, v.vip_prenom, v.vip_nom, SUBSTR(v.vip_texte, 1, 100) as vip_texte, p.photo_commentaire, p.photo_adresse from vip v, photo p where v.vip_numero = p.vip_numero and p.photo_numero = 1 order by v.vip_nom, v.vip_prenom asc`;
    return db.promise().execute(sql).then(([rows]) => {
        return rows;
    });
}

module.exports.getAllVipWithPhoto = function() {
    let sql = `select v.vip_numero, v.vip_prenom, v.vip_nom from vip v, photo p where v.vip_numero = p.vip_numero and p.photo_numero != 1 group by v.vip_numero order by v.vip_nom, v.vip_prenom asc`;
    return db.promise().execute(sql).then(([rows]) => {
        return rows;
    });
}

module.exports.getAllPhotoVip = function(vip_numero) {
    let sql = `select vip_numero, photo_numero, photo_sujet, photo_commentaire, photo_adresse from photo where vip_numero = ${vip_numero} and photo_numero != 1`;
    return db.promise().execute(sql).then(([rows]) => {
        return rows;
    });
}

module.exports.supprimerPhoto = function(vip_numero, photo_adresse) {
    let sql = `DELETE FROM photo WHERE VIP_NUMERO=${vip_numero} AND PHOTO_ADRESSE="${photo_adresse}";`;
    return db.promise().execute(sql).then(([rows]) => {
        return rows;
    });
}

module.exports.addPhotoVIP = async function(infos, adresse) {
    let sql = `select photo_numero from photo where VIP_NUMERO = ${infos.vip_numero} order by photo_numero desc limit 1`;
    return db.promise().execute(sql).then(([rows]) => {
        let sql = `INSERT INTO photo (PHOTO_NUMERO, VIP_NUMERO, PHOTO_SUJET, PHOTO_COMMENTAIRE, PHOTO_ADRESSE) VALUES(${rows[0].photo_numero + 1}, '${infos.vip_numero}', '${infos.titre}', '${infos.comPh}', '${adresse}');`;
        return db.promise().execute(sql).then(([rows]) => {
            return rows;
        });
    });
}
