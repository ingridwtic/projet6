const express = require('express');
const auth = require('../middleware/auth');
//const router= express.Router();
const multer = require('../middleware/multer-config');


// importer le controler
const sauceControl = require('../controllers/sauce')
const router= express.Router();
//const Sauce = require('../models/sauce');

//envoie de la demande post à notre route
router.post('/', auth, multer, sauceControl.createSauce); //mettre l'auth avant le gestionnaire de route saucecontrol pour qu'il puisse tenir compte de lui

// renvoyer un tableau contenant toute les choses de notre base de donnée
router.get('/', auth, sauceControl.getAllSauce);

//rechercher un objet spécifique de manière dynamique   
router.get('/:id', auth, sauceControl.getOneSauce);

//modifier ou mettre à jour un objet dans la base de données
router.put('/:id', auth, multer, sauceControl.modifySauce);

//supprimer un objet dans la base de donnée
router.delete('/:id', auth, sauceControl.deleteSauce); //authentifier les requettes grâce au middlewere auth

//route pour intercepter une requêtte  post like
router.post('/:id/like', auth, sauceControl.likeSauce);

//exporter le router
module.exports = router;