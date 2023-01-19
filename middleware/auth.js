
// const jwt = require('jsonwebtoken')
// const bcrypt = require('bcrypt')
// const loginRouter = require('express').Router()
// const User = require('../models/user')

// const dotenv = require('dotenv');
// const result = dotenv.config(); 

// loginRouter.post('/', async (request, response) => {
//     const { username, password } = request.body

//     const user = await User.findOne({ username })
//     const passwordCorrect = user === null
//     ? false
//     : await bcrypt.compare(password, user.passwordHash)

//     if (!(user && passwordCorrect)) {
//         return response.status(401).json({
//         error: 'invalid username or password'
//         })
//     }

// const userForToken = {
//     username: user.username,
//     id: user._id,
// }

// const token = jwt.sign(userForToken, process.env.SECRET)

//     response
//     .status(200)
//     .send({ token, username: user.username, name: user.name })
// })

// module.exports = loginRouter

// appelle jsonwebtoken pour le middleware d'authentification
const jwt = require ('jsonwebtoken');
const dotenv = require('dotenv');
const result = dotenv.config(); 
// verifier les information du token grâce au midlleware
module.exports = (req, res, next) => {

    try {
        // on utilise le header authorization de la requete (CORS) on split le tableau et on récupère l'élément à l'indice 1 (Bearer Token)
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