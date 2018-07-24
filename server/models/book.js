var mongoose = require('mongoose');

var Book = mongoose.model('Book', {
    titre: {
        type:String,
        required:true,
        trim:true,
        minlength:1
    },
    auteur: {
        type:String,
        default: null
    },
    prix: {
        type:Number,
        default: null
    }
  });

  module.exports={Book};