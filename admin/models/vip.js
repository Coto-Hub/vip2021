let db = require('../configDb');

db.connect(function(err) {
    if (err) throw err;
});

module.exports.getAllNationalites = async function() {
    let sql = `select nationalite_numero, nationalite_nom from nationalite`;
    return db.promise().execute(sql).then(([rows]) => {
        return rows;
    });
}

module.exports.addVIP = async function(infos) {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let dateTot = year + "-" + month + "-" + date;
    let sql = `INSERT INTO vip (NATIONALITE_NUMERO, VIP_NOM, VIP_PRENOM, VIP_SEXE, VIP_NAISSANCE, VIP_TEXTE, VIP_DATE_INSERTION) VALUES('${infos.natio}', '${infos.nom}', '${infos.prenom}', '${infos.sexe}', '${infos.date}', '${infos.com}', '${dateTot}');`;
    return db.promise().execute(sql).then(([rows]) => {
        let sql = `SELECT vip_numero from vip where VIP_NOM = '${infos.nom}' and VIP_PRENOM = '${infos.prenom}'`;
        return db.promise().execute(sql).then(([rows]) => {
            return rows[0];
        });
    });
}
module.exports.updateVIP = async function(infos) {
    let sql = `UPDATE vip SET NATIONALITE_NUMERO='${infos.natio}', VIP_NOM='${infos.nom}', VIP_PRENOM='${infos.prenom}', VIP_SEXE='${infos.sexe}', VIP_NAISSANCE='${infos.date}', VIP_TEXTE="${(infos.com).replace(/"/g, '\\"')}" WHERE VIP_NUMERO=${infos.vip_numero};`;
    return db.promise().execute(sql).then(([rows]) => {
        return rows;
    });
}
module.exports.updatePhoto = async function(infos, adresse) {
    let sql = `UPDATE photo SET PHOTO_SUJET="${infos.sujet}", PHOTO_COMMENTAIRE="${infos.comPh}", PHOTO_ADRESSE='${adresse}' WHERE PHOTO_NUMERO=1 AND VIP_NUMERO=${infos.vip_numero};`;
    return db.promise().execute(sql).then(([rows]) => {
        return rows;
    });
}
module.exports.addPhotoVIP = async function(vip_numero, infos, adresse) {
    let sql = `INSERT INTO photo (PHOTO_NUMERO, VIP_NUMERO, PHOTO_SUJET, PHOTO_COMMENTAIRE, PHOTO_ADRESSE) VALUES(1, '${vip_numero}', '${infos.sujet}', '${infos.comPh}', '${adresse}');`;
    return db.promise().execute(sql).then(([rows]) => {
        return rows;
    });
}

module.exports.getAllVip = function() {
    let sql = `select v.vip_numero, v.vip_prenom, v.vip_nom, SUBSTR(v.vip_texte, 1, 100) as vip_texte, p.photo_commentaire, p.photo_adresse from vip v, photo p where v.vip_numero = p.vip_numero and p.photo_numero = 1 order by v.vip_nom, v.vip_prenom asc`;
    return db.promise().execute(sql).then(([rows]) => {
        return rows;
    });
}
module.exports.getInfoPersonne = async function(request) {
    let sql = `select v.vip_numero, v.vip_sexe, p.photo_adresse, p.photo_sujet, p.photo_commentaire, v.vip_prenom, v.vip_nom, v.nationalite_numero, n.nationalite_nom, v.vip_naissance, v.vip_texte from vip v, photo p, nationalite n where v.vip_numero = ${request} and v.vip_numero = p.vip_numero and v.nationalite_numero = n.nationalite_numero and p.photo_numero = 1`;
    return db.promise().execute(sql).then(([rows]) => {
        return rows[0];
    });
}
module.exports.getAllOtherNationalites = async function(request) {
    let sql = `select nationalite_numero, nationalite_nom from nationalite where nationalite_numero != ${request}`;
    return db.promise().execute(sql).then(([rows]) => {
        return rows;
    });
}
module.exports.supprimerVip = function(request) {
    db.promise().beginTransaction().then(() => {
        return Promise.all([
            db.promise().execute(`DELETE FROM defile WHERE VIP_NUMERO=${request};`),
            db.promise().execute(`DELETE FROM apouragence WHERE VIP_NUMERO=${request};`),
            db.promise().execute(`DELETE FROM composer WHERE VIP_NUMERO=${request};`),
            db.promise().execute(`DELETE FROM mariage WHERE VIP_NUMERO=${request} OR VIP_VIP_NUMERO=${request};`),
            db.promise().execute(`DELETE FROM liaison WHERE VIP_NUMERO=${request} OR VIP_VIP_NUMERO=${request};`),
            db.promise().execute(`DELETE FROM photo WHERE VIP_NUMERO=${request};`),
            db.promise().execute(`DELETE FROM joue WHERE VIP_NUMERO in (select FILM_NUMERO from film where vip_numero = ${request});`),
            db.promise().execute(`DELETE FROM apoursujet WHERE VIP_NUMERO=${request};`),
        ]).catch(() => {
        })
    }).then(() => {
        db.promise().beginTransaction().then(() => {
            return Promise.all([
                db.promise().execute(`DELETE FROM film WHERE VIP_NUMERO = ${request};`),
                db.promise().execute(`DELETE FROM film WHERE FILM_NUMERO IN (select FILM_NUMERO FROM joue WHERE vip_numero = ${request});`),
                db.promise().execute(`DELETE FROM article WHERE ARTICLE_NUMERO IN (select ARTICLE_NUMERO FROM apoursujet WHERE vip_numero = ${request});`),
                db.promise().execute(`DELETE FROM defiledans WHERE VIP_NUMERO=${request};`),
                db.promise().execute(`DELETE FROM couturier WHERE VIP_NUMERO=${request};`),
                db.promise().execute(`DELETE FROM chanteur WHERE VIP_NUMERO=${request};`),
                db.promise().execute(`DELETE FROM mannequin WHERE VIP_NUMERO=${request};`),
                db.promise().execute(`DELETE FROM acteur WHERE VIP_NUMERO=${request};`)
            ]).catch(() => {
            })
        }).then(() => {db.promise().beginTransaction().then(() => {
            return Promise.all([
                db.promise().execute(`DELETE FROM realisateur WHERE VIP_NUMERO=${request};`),
                db.promise().execute(`DELETE FROM acteur WHERE VIP_NUMERO=${request};`)
            ]).catch(() => {
            })
        }).then(() => {
            return Promise.all([
                db.promise().execute(`DELETE FROM vip WHERE VIP_NUMERO=${request};`)
            ]).catch(() => {
            })
        }).then(() => {

        });
        });
    });
}
