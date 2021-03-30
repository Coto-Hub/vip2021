let HomeController = require('./../controllers/HomeController');
let VipController = require('./../controllers/VipController');
let AlbumController = require('./../controllers/AlbumController');
let ArticlesController = require('./../controllers/ArticlesController');



// Routes
module.exports = function(app){

// Main Routes
    app.get('/', HomeController.Index);
    app.get('/accueil', HomeController.Index);

// VIP
    app.get('/repertoire', VipController.Repertoire);
    app.get('/repertoire/:lettre', VipController.listerPersonnes);
    app.get('/repertoire/vip/:vip_numero', VipController.infoPersonne);

// albums
    app.get('/album', AlbumController.ListerAlbum);
    app.get('/album/:page_menu/:vip_numero', AlbumController.ListerPhoto);

// articles
    app.get('/articles', ArticlesController.ListerArticles);
    app.get('/articles/:vip_numero', ArticlesController.ListerArticlesVip);

// tout le reste
    app.get('*', HomeController.NotFound);
    app.post('*', HomeController.NotFound);

};
