// ////////////////////// L I S T E R     A L B U M S
const model = require("../models/vip");

module.exports.ListerAlbum = async function (request, response) {
    response.vips = await model.getAllVip();
    response.num_page = 0;
    response.vip_num = 0;
    response.content = "Choisissez un vip pour voir ces photos";
    response.render('listerAlbum', response);
} ;

module.exports.ListerPhoto = async function (request, response) {
    response.vips = await model.getAllVip();
    response.listePhoto = await model.getAllPhotoVip(request.params.vip_numero);
    response.vip_num = request.params.vip_numero;
    response.num_page = request.params.page_menu;
    response.content = "Il n'y a pas de photo disponible pour ce vip";
    response.render('listerAlbum', response);
} ;
