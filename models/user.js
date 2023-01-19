//importer mongoose
const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

//ajout d'un model user
const userSchema = mongoose.Schema({
    email:{ type: String, required: true, unique: true}, //unique pour n'utiliser qu'une seule adresse pour un compte
    password: { type: String, required: true}
});

//appliquer le validateur au schema
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', userSchema);