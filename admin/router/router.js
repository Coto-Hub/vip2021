let AdministrationController = require('../controllers/AdministrationController');
let VipController = require('./../controllers/VipController');
let PhotoController = require('../controllers/PhotoController');



// Routes
module.exports = function(app){

// Main Routes
    app.get('/', AdministrationController.Index);
    app.get('/Administration', AdministrationController.Index);
    app.post('/Administration', AdministrationController.Connexion);
    app.get('/Deconnexion', AdministrationController.Deconnexion);

// G E S T I O N    V I P S
    app.get('/GestionVips/ajouterVip', verifConnexion, VipController.affichAjouterVip);
    app.get('/GestionVips/modifierVip', verifConnexion, VipController.affichListerVip);
    app.get('/GestionVips/modifierVip/:vip_numero', verifConnexion, VipController.affichModifierVip);
    app.get('/GestionVips/supprimerVip', verifConnexion, VipController.affichSupprimerVip);

    app.post('/GestionVips/ajouterVip', verifConnexion, VipController.ajouterVip);
    app.post('/GestionVips/modifierVip', verifConnexion, VipController.modifierVip);
    app.post('/GestionVips/supprimerVip', verifConnexion, VipController.supprimerVip);

// G E S T I O N    P H O T O S
     app.get('/GestionPhotos/ajouterPhoto', verifConnexion, PhotoController.affichAjouterPhoto);
     app.get('/GestionPhotos/supprimerPhoto', verifConnexion, PhotoController.affichListerPhoto);
    app.get('/GestionPhotos/supprimerPhoto/:vip_numero', verifConnexion, PhotoController.affichSupprimerPhoto);

    app.post('/GestionPhotos/ajouterPhoto', verifConnexion, PhotoController.ajouterPhoto);
    app.post('/GestionPhotos/supprimerPhoto', verifConnexion, PhotoController.supprimerPhoto);

// tout le reste
    app.get('*', AdministrationController.NotFound);
    app.post('*', AdministrationController.NotFound);

// M I D D L E W A R E
    function verifConnexion(request, response, next) {
        if(request.session.login !== undefined) {
            next();
        }
        else {
            response.redirect("/");
        }
    }
};
