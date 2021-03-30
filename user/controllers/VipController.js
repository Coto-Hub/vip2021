const model = require("../models/vip.js");
const async = require("async");

/////////////////////////// R E P E R T O I R E    D E S     S T A R S

module.exports.Repertoire = async function (request, response) {
    response.title = 'Répertoire des stars';
    response.pre_lettre = await model.getAllPremiereLettre();
    response.render('repertoireVips', response);
} ;
module.exports.listerPersonnes = async function (request, response) {
    response.title = 'Répertoire des stars';
    response.pre_lettre = await model.getAllPremiereLettre();
    response.personnes = await model.getAllPersonnesLettre(request.params.lettre);
    response.render('repertoireVips', response);
}
module.exports.infoPersonne = async function (request, response) {
    response.title = 'Répertoire des stars';
    response.pre_lettre = await model.getAllPremiereLettre();
    response.couturier = undefined;
    response.mannequin = undefined;
    response.acteur = undefined;
    response.realisateur = undefined;
    response.personne = await model.getInfoPersonne(request.params.vip_numero);
    response.temp = await model.getProfessionPersonne(request.params.vip_numero);
    response.mariage = await model.getMariages(request.params.vip_numero);
    response.liaison = await model.getLiaison(request.params.vip_numero);
    response.photos = await model.getAllPhoto(request.params.vip_numero);
    if (response.temp.couturier === "yes") {
        if (response.personne.vip_sexe === "F") {
            response.couturier = "Couturière"
        } else {
            response.couturier = "Couturier"
        }
        response.defileCout = await model.getDefileCouturier(request.params.vip_numero);
    }
    if (response.temp.mannequin === "yes") {
        response.mannequin = "Mannequin";
        response.defileVip = await model.getDefileMannequin(request.params.vip_numero);
    }
    if (response.temp.chanteur === "yes") {
        if (response.personne.vip_sexe === "F") {
            response.chanteur = "Chanteuse"
        } else {
            response.chanteur = "Chanteur"
        }
        response.albums = await model.getAlbumsVip(request.params.vip_numero);
    }
    if (response.temp.acteur === "yes") {
        if (response.personne.vip_sexe === "F") {
            response.acteur = "Actrice"
        } else {
            response.acteur = "Acteur"
        }
        response.filmJoue = await model.getFilmActeur(request.params.vip_numero);
    }
    if (response.temp.realisateur === "yes") {
        if (response.personne.vip_sexe === "F") {
            response.realisateur = "Réalisatrice"
        } else {
            response.realisateur = "Réalisateur"
        }
        response.filmReal = await model.getFilmReal(request.params.vip_numero);
    }
    response.render('repertoireVips', response);
}
