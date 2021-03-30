// ////////////////////// L I S T E R     A L B U M S
const model = require("../models/photo");
const fs = require('fs')

module.exports.affichAjouterPhoto = async function (request, response) {
    response.vips = await model.getAllVip();
    response.render('ajouterPhoto', response);
}

module.exports.affichListerPhoto = async function (request, response) {
    response.vips = await model.getAllVipWithPhoto();
    response.content = 'Choisissez un vip pour supprimer une de ces photos';
    response.render('supprimerPhoto', response);
}
module.exports.affichSupprimerPhoto = async function (request, response) {
    response.vips = await model.getAllVipWithPhoto();
    response.photos = await model.getAllPhotoVip(request.params.vip_numero);
    response.render('supprimerPhoto', response);
}

module.exports.ajouterPhoto = async function (request, response) {
    response.success = "Ajout de la photo effectué";
    await request.files.sampleFile.mv("../public/images/vip/" + request.files.sampleFile.name)
    await model.addPhotoVIP(request.body, request.files.sampleFile.name);
    response.render('success', response);
}
module.exports.supprimerPhoto = async function (request, response) {
    const path = '../public/images/vip/' + request.body.photo_adresse;
    fs.unlink(path, (err) => {
        if (err) {
            console.error(err)
        }
    });
    await model.supprimerPhoto(request.body.vip_numero, request.body.photo_adresse);
    response.redirect('/GestionPhotos/supprimerPhoto');
}
