const model = require("../models/vip.js");
const async = require("async");
const fs = require('fs')
/////////////////////////// R E P E R T O I R E    D E S     S T A R S

module.exports.affichAjouterVip = async function (request, response) {
    response.nationalites = await model.getAllNationalites();
    response.render('ajouterVip', response);
}
module.exports.affichListerVip = async function (request, response) {
    response.vips = await model.getAllVip();
    response.content = 'Choisissez un vip pour le modifier';
    response.render('modifierVip', response);
}
module.exports.affichModifierVip = async function (request, response) {
    response.vips = await model.getAllVip();
    response.vip = await model.getInfoPersonne(request.params.vip_numero);
    response.nationalites = await model.getAllOtherNationalites(response.vip.nationalite_numero);
    response.isMen = (response.vip.vip_sexe === 'M');
    response.render('modifierVip', response);
}
module.exports.affichSupprimerVip = async function (request, response) {
    response.vips = await model.getAllVip();
    response.render('supprimerVip', response);
}

module.exports.ajouterVip = async function (request, response) {
    await request.files.sampleFile.mv("../public/images/vip/" + request.files.sampleFile.name)
    let info = await model.addVIP(request.body);
    await model.addPhotoVIP(info.vip_numero, request.body, request.files.sampleFile.name);
    response.success = "Ajout du VIP effectué";
    response.render('success', response);
}
module.exports.modifierVip = async function (request, response) {
    if (request.files !== null) {
        const path = './public/images/vip/' + request.body.photo_adresse;
        fs.unlink(path, (err) => {
            if (err) {
                console.error(err)
            }
        });
        await request.files.sampleFile.mv("../public/images/vip/" + request.files.sampleFile.name)
        await model.updatePhoto(request.body, request.files.sampleFile.name);
    }
    await model.updateVIP(request.body);
    response.success = "Modification du VIP effectué";
    response.render('success', response);
}
module.exports.supprimerVip = async function (request, response) {
    const path = '../public/images/vip/' + request.body.photo_adresse;
    fs.unlink(path, (err) => {
        if (err) {
            console.error(err)
        }
    });
    await model.supprimerVip(request.body.vip_numero);
    response.redirect('/GestionVips/supprimerVip');
}
