const multer = require('multer');

//creation du dictionnaire image
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    "image/bmp": "bmp",
    "image/gif": "gif"
};

 //configurer la destination multer
const storage = multer.diskStorage({
    destination:(req, file, callback) => {
        callback(null, 'images');
    },
filename: (req, file, callback) => {  // configurer quel nom de fichier utiliser
    const name = file.originalname.split (' ').join('_'); // eliminer les espace avec split
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.'+ extension);

} 

});

module.exports = multer({storage : storage}).single('image');