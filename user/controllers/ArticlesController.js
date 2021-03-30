// ////////////////////// L I S T E R     A R T I C L E S

const model = require("../models/vip");
module.exports.ListerArticles = async function (request, response) {
    response.vips = await model.getAllVipWithArticle();
    response.content = 'Choisissez un vip pour voir les articles le concernant';
    response.render('listerArticles', response);
} ;

module.exports.ListerArticlesVip = async function (request, response) {
    response.vips = await model.getAllVipWithArticle();
    response.articlesVip = await model.getAllArticlesVip(request.params.vip_numero);
    response.content = 'Le vip sélectionné n\'a pas d\'article !';
    response.render('listerArticles', response);
} ;
