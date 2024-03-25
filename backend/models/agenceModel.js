const mongoose=require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const AgenceSchema= new Schema({
   nom : {
    type : String ,
    required : true,
   },
   numeroAgence :{
    type: Number,
    required : true,
   },
   adresseAgence : {
   type : String,
   required : true,
   },

   numeroEntreprisesParAgence:{
      type : Number,

   },


}, { timestamps: true })

module.exports=mongoose.model('Agence',AgenceSchema);
