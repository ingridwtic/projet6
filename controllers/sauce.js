//naviger dans les fichiers à l'aide de file system 
const fs = require('fs');
//recuperer les modèles de sauce 
const Sauce = require('../models/sauce');

//envoie de la demande post à notre route
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);//?
    delete sauceObject._id;       //supprimer l'userId
    delete sauceObject._userId;  //supprimer l'userId
    const sauce = new Sauce({
        ...sauceObject, // enumère les propriétés d'un objet et ajoute les paires clé-valeur à l'objet en cours de création
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` //Generer l'url de l'image
    });
    //enregistrer la sauce dans la base de donnée
    sauce.save()
    .then(() => { res.status(201).json({message: 'Sauce enregistrée !'})})
    .catch(error => { res.status(400).json( { error })})
};

exports.getOneSauce = async(req, res, next) => {
try {

    // trouver la sauce dans la base de donnée
    const oneSauce = await Sauce.findOne({ _id: req.params.id });

    // verifiez si la sauce est trouvée
    if (!oneSauce) {
        return res.status(404).json({ message: "Sauce non trouvée" });
    }

    // Retourner la sauce
    return res.status(200).json(oneSauce);
} catch (error) {   
    console.error(error);
    return res.status(500).json({ message: "Erreur lors de la récupération de la sauce" });
}
};


// renvoyer un tableau contenant toute les choses de notre base de donnée
exports.getAllSauce = async (req, res, next) => {   
    const allSauce = await Sauce.find().then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));

    
}
//modifier ou mettre à jour un objet dans la base de données

//modifier ou mettre à jour un objet dans la base de données

exports.modifySauce = async (req, res, next) => {
    const sauceObject = req.file ? {  // req.file? pour verifier si la requête contient un fichier
        ...JSON.parse(req.body.sauce), // on extrait le sauce de la requete via le json.parse
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete sauceObject._userId;
    const sauce = await Sauce.findOne({_id: req.params.id}).catch((error) => {
        res.status(400).json({ error })
    });

    if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message : 'Non autorisé'});
    } else {
        await Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id}).catch(error => res.status(401).json({ error }));
        res.status(200).json({message : 'Sauce modifié!'})
        
    }
        
    };
    //supprimer un objet dans la base de donnée
    
    exports.deleteSauce = async (req, res, next) => {
        const sauce = await Sauce.findOne({ _id: req.params.id}).catch( error => {
            res.status(500).json({ error });
        });
        if (sauce.userId != req.auth.userId) { // si userId de la sauce est different de celui identifié par le token 
            res.status(401).json({message: 'Non autorisé'});
        } else {
            const filename = sauce.imageUrl.split('/images/')[1]; //Récuperer l'url de l'image, séparer la partie image avec la méthode split et extraire le fichier [1]
            fs.unlink(`images/${filename}`, async () => { //supprimer le fichier image de la sauce choisi grace à unlink
                await Sauce.deleteOne({_id: req.params.id}).catch(error => res.status(401).json({ error })); //supprimer la Sauce avec son id
                res.status(200).json({message: 'Sauce supprimé !'})

            });
        }
        
            
    };
    

    //Liker une sauce
    exports.likeSauce = (req, res, next) => {
    
        // Si la requete à 1 like
        if (req.body.like === 1) {
    // Utilisation de updateOne / $inc recoit une valeur type NUMBER => ++ permet de l'incrémenté / $push renvoit la nouvelle valeur de l'array usersLike
            Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
                .then(() => res.status(200).json({ message: 'Like ajouté !' }))
                .catch(error => res.status(400).json({ error }))

        //Si le corps de la requêtte contient une dislike

        } else if (req.body.like === -1) {

        
              Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } })
                .then(() => res.status(200).json({ message: 'Dislike ajouté !' }))
                .catch(error => res.status(400).json({ error }))
        } else {
            Sauce.findOne({ _id: req.params.id })
                .then(sauce => {
                    // Si le tableau des likes de la sauce contient l'id de l'utilisateur
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        
                        //Permet de retirer 1 à la valeur de like et donc de la passer à 0
                        Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                            .then(() => { res.status(200).json({ message: 'Like supprimé !' }) })
                            .catch(error => res.status(400).json({ error }))
                          //Permet de retirer 1 à la valeur de disliked et donc de la passer à 0   
                    } else if (sauce.usersDisliked.includes(req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                            .then(() => { res.status(200).json({ message: 'Dislike supprimé !' }) })
                            .catch(error => res.status(400).json({ error }))
                    }
                })
                .catch(error => res.status(400).json({ error }))
        }
    }

