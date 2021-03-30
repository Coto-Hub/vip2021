let db = require('../configDb');
db.connect(function(err) {
    if (err) throw err;
});

module.exports.test = async function(callback) {
    let sql = `SELECT COUNT(*) AS NB FROM vip`;
    return db.promise().execute(sql).then(([rows]) => {
        return rows;
    });
};

module.exports.getAllPremiereLettre = async function () {
    const sql = `select distinct left(vip_nom, 1) as pre_lettre FROM vip order by pre_lettre asc`;
    return db.promise().execute(sql).then(async ([rows]) => {
        return rows;
    });
}
module.exports.getAllPersonnesLettre = async function(request) {
    const sql = `select vip.vip_numero, vip_prenom, vip_nom, photo_adresse from vip, photo where left(vip_nom, 1) = \"${request}\" and vip.VIP_NUMERO = photo.VIP_NUMERO and photo_numero = 1 order by vip_prenom asc`;
    return db.promise().execute(sql).then(([rows]) => {
        return rows;
    });
}
module.exports.getInfoPersonne = async function(request) {
    let sql = `select vip_sexe, photo_adresse, vip_prenom, vip_nom, nationalite_nom, vip_naissance, vip_texte from vip v, nationalite n, photo p where v.vip_numero = ${request} and v.nationalite_numero = n.nationalite_numero and v.vip_numero = p.vip_numero and p.photo_numero = 1`;
    return db.promise().execute(sql).then(([rows]) => {
        return rows[0];
    });
}
module.exports.getProfessionPersonne = function(request) {
    let sql = `select if (exists(select * from couturier where VIP_NUMERO = ${request}), "yes", "no") as couturier, 
                if (exists(select * from mannequin where VIP_NUMERO = ${request}), "yes", "no") as mannequin, 
                if (exists(select * from chanteur where VIP_NUMERO = ${request}), "yes", "no") as chanteur,
                if (exists(select * from acteur where VIP_NUMERO = ${request}), "yes", "no") as acteur,
                if (exists(select * from realisateur where VIP_NUMERO = ${request}), "yes", "no") as realisateur`;
    return db.promise().execute(sql).then(([rows]) => {
        return rows[0];
    });
}
module.exports.getFilmActeur = function(request) {
    let sql = `select f.film_titre, v.vip_numero, v.vip_nom, v.vip_prenom, SUBSTR(v.vip_texte, 1, 100) as vip_texte, p.photo_adresse, f.film_daterealisation from film f, joue j, vip v, photo p 
                        where f.film_numero = j.film_numero and j.vip_numero = ${request} and f.vip_numero = v.vip_numero and v.vip_numero = p.vip_numero and p.photo_numero = 1`;
    return db.promise().execute(sql).then(([rows]) => {
        return rows;
    });
}
module.exports.getDefileMannequin = function(request) {
    let sql = `select v.vip_numero, v.vip_nom, v.vip_prenom, SUBSTR(v.vip_texte, 1, 100) as vip_texte, p.photo_adresse, d2.defile_lieu, d2.defile_date from defiledans d1, defile d2, vip v, photo p 
               where d1.defile_numero = d2.defile_numero and d1.vip_numero = ${request} and d2.vip_numero = v.vip_numero and v.vip_numero = p.vip_numero and p.photo_numero = 1`;

    return db.promise().execute(sql).then(([rows]) => {
        return rows;
    });
}
module.exports.getFilmReal= function(request) {
    let sql = `select film_titre, film_daterealisation from film where vip_numero = ${request}`;
    return db.promise().execute(sql).then(([rows]) => {
        return rows;
    });
}
module.exports.getDefileCouturier= function(request) {
    let sql = `select defile_lieu, defile_date from defile where vip_numero = ${request}`;
    return db.promise().execute(sql).then(([rows]) => {
        return rows;
    });
}
module.exports.getAlbumsVip = function(request) {
    let sql = `select m.maisondisque_nom, a.album_titre, a.album_date from composer c, album a, 
               maisondisque m where c.vip_numero = ${request} and c.album_numero = a.album_numero
               and a.maisondisque_numero = m.maisondisque_numero`;
    return db.promise().execute(sql).then(([rows]) => {
        return rows;
    });
}
module.exports.getMariages = function(request) {
    let sql = `select v.vip_numero, v.vip_nom, v.vip_prenom, SUBSTR(v.vip_texte, 1, 100) as vip_texte, p.photo_adresse, m.date_evenement, m.mariage_lieu, m.mariage_fin, m.mariage_motiffin from mariage m, vip v, photo p 
    where m.vip_numero = ${request} and m.vip_vip_numero = v.vip_numero and v.vip_numero = p.vip_numero and p.photo_numero = 1
    union 
    select v.vip_numero, v.vip_nom, v.vip_prenom, SUBSTR(v.vip_texte, 1, 100) as vip_texte, p.photo_adresse, m.date_evenement, m.mariage_lieu, m.mariage_fin, m.mariage_motiffin from mariage m, vip v, photo p 
    where m.vip_vip_numero = ${request} and m.vip_numero = v.vip_numero and v.vip_numero = p.vip_numero and p.photo_numero = 1`;
    return db.promise().execute(sql).then(([rows]) => {
        return rows;
    });
}
module.exports.getLiaison = function(request) {
    let sql = `select v.vip_numero, v.vip_nom, v.vip_prenom, SUBSTR(v.vip_texte, 1, 100) as vip_texte, p.photo_adresse, l.date_evenement, l.liaison_motiffin from liaison l, vip v, photo p 
    where l.vip_numero = ${request} and l.vip_vip_numero = v.vip_numero and v.vip_numero = p.vip_numero and p.photo_numero = 1
    union 
    select v.vip_numero, v.vip_nom, v.vip_prenom, SUBSTR(v.vip_texte, 1, 100) as vip_texte, p.photo_adresse, l.date_evenement, l.liaison_motiffin from liaison l, vip v, photo p
    where l.vip_vip_numero = ${request} and l.vip_numero = v.vip_numero and v.vip_numero = p.vip_numero and p.photo_numero = 1`;
    return db.promise().execute(sql).then(([rows]) => {
        return rows;
    });
}
module.exports.getAllPhoto = function(request) {
    let sql = `select photo_adresse, photo_sujet, photo_commentaire from photo where vip_numero = ${request} and photo_numero != 1`;
    return db.promise().execute(sql).then(([rows]) => {
        return rows;
    });
}

module.exports.getAllPhotoVip = function(request) {
    let sql = `select v.vip_numero, v.vip_prenom, v.vip_nom, p.photo_adresse, p.photo_commentaire from vip v, photo p where v.vip_numero = p.vip_numero and p.vip_numero = ${request}`;
    return db.promise().execute(sql).then(([rows]) => {
        return rows;
    });
}

module.exports.getAllVip = function() {
    let sql = `select v.vip_numero, v.vip_prenom, v.vip_nom, p.photo_commentaire, p.photo_adresse from vip v, photo p where v.vip_numero = p.vip_numero and p.photo_numero = 1 order by v.vip_nom, v.vip_prenom asc`;
    return db.promise().execute(sql).then(([rows]) => {
        return rows;
    });
}

module.exports.getAllVipWithArticle = function() {
    let sql = `select distinct v.vip_numero, v.vip_prenom, v.vip_nom, p.photo_commentaire, p.photo_adresse from vip v, photo p, apoursujet a where v.vip_numero = p.vip_numero and v.vip_numero = a.vip_numero and p.photo_numero = 1 order by v.vip_nom, v.vip_prenom asc`;
    return db.promise().execute(sql).then(([rows]) => {
        return rows;
    });
}

module.exports.getAllArticlesVip = function(request) {
    let sql = `select v.vip_numero, v.vip_prenom, v.vip_nom, a.article_resume, a.article_date_insert from vip v, article a, apoursujet a2 where a.article_numero = a2.article_numero and a2.vip_numero = v.vip_numero and a2.vip_numero = ${request} order by a.article_date_insert desc`;
    return db.promise().execute(sql).then(([rows]) => {
        return rows;
    });
}
