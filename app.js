const express = require('express');
const  bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');  //importer mongoose dans app.js

//importer la router
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauce');



mongoose.connect('mongodb+srv://ingridWongoue:mongoodb.0@cluster0.lqzauju.mongodb.net/?retryWrites=true&w=majority',
{ useNewUrlParser: true,
    useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(express.json()); //acceder au corps de la requêtte

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
app.use(bodyParser.json());

//importer la route 
app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);
app.use('/images', express.static(path.join(__dirname, 'images'))) //ajouter une route les fichier statique image

module.exports = app;