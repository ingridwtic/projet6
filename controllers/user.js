const bCrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const dotenv = require('dotenv');
const result = dotenv.config();

//enregistrement de nouveau utilisateur et cripter le mot de passe
exports.signup = (req, res, next) => {
    console.log(req.body)
bCrypt.hash(req.body.password, 10)
.then(hash => {
    const user = new User ({
        email: req.body.email,
        password: hash
    });
user.save()
    .then(() => res.status(201).json({message: 'Utilisateur créé !'}))
    .catch(error => res.status(400).json({error}));

})
.catch(error => res.status(500).json({error}));
};


//connecter les utilisateurs existants
exports.login = (req, res, next) => {
User.findOne ({email: req.body.email})
.then(user => {
    if (user === null) {
        res.status(401).json({message:'Paire identifiant/mot de passe incorrecte'})
    } else {
        bCrypt.compare(req.body.password, user.password)  // bcript compare l'ancien password au nouveau
        .then(valid => {
            if(!valid){
                res.status(401).json({message:'Paire identifiant/mot de passe incorrecte'})
            } else{
                res.status(200).json({
                    userId: user._id,
                    token:jwt.sign(
                        {userId: user._id},
                        //'RANDOM_TOKEN_SECRET',
                        process.env.TOKEN_SECRET_ALEATOIRE,
                        {expiresIn: '24h'}
                    )
                });
            }
        })
    }
})
.catch(error =>{
    res.status(500).json({error})
})
};

