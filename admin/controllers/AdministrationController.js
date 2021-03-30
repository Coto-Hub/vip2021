// ////////////////////////////////////////////// C O N N E X I O N
const model = require("../models/connexion");

module.exports.Index = function(request, response){
    response.render('connexion', response);
};
module.exports.Connexion = async function (request, response) {
    if (await model.getConnexionValide(request.body.login, request.body.password)) {
        request.session.login = request.body.login;
        response.render('home', response);
    }
    else {
        response.error = "Login ou Mot de passe incorrect";
        response.render('connexion', response);
    }
};

module.exports.Deconnexion = function(request, response){
    request.session.login = undefined;
    response.redirect("/");
};

module.exports.NotFound = function(request, response){
    response.render('notFound', response);
};
