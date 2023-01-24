// appelle jsonwebtoken pour le middleware d'authentification
// JWT pour l’échange de données sécurisées entre deux parties
const jwt = require ('jsonwebtoken');
//Dotenv est un module sans dépendance qui charge les variables d'environnement d'un .envfichier dans process.env
const dotenv = require('dotenv');
//configurez dotenv pour que process.env ait  les clés et les valeurs définies dans le .env fichier
const result = dotenv.config(); 
// verifier les information du token grâce au midlleware
module.exports = (req, res, next) => {

    try {
        // on utilise le header authorization de la requete (CORS) on split le tableau et on récupère l'élément à l'indice 1 (Bearer)
        const token = req.headers.authorization.split(" ")[1];
        // décoder le token en vérifiant qu'il correspond avec sa clef secrète
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_ALEATOIRE);
        
        // on récupère le user id décodé par le jwt.vérify
        const userId = decodedToken.userId;
        // on rajoute l'objet userId à l'objet requete
        req.auth = { userId : userId };
        next();
        }
        catch (error) {
            res.status(401).json({error})
        }
    }