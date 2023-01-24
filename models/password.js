// on appelle password validator https://www.npmjs.com/package/password-validator
var passwordValidator = require('password-validator');
var passwordSchema = new passwordValidator();
// le modèle du mot de passe
passwordSchema
.is().min(8)                                   
.is().max(20)                                  
.has().uppercase(1)                           
.has().lowercase()                              
.has().symbols(1)
.has().digits(1) 
.is().not(/[\]()[{}<>@]/)                              
.has().not().spaces()                           
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

// Valider par rapport à une chaîne de mot de passe
console.log(schema.validate('validPASS123'));
// => vrai
console.log(schema.validate('invalidPASS'));
// => faux

// Obtenir une liste complète des règles qui ont échoué
console.log(schema.validate('joke', { list: true }));
// => [ 'min', 'majuscule', 'chiffres' ]

module.exports = passwordSchema;