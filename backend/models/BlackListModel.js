const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const BlackListSchema= new Schema({
  Nom : {
    type : String,
    // required:true
  },
  NumeroEtablissement:
  {
    type: String,
    // required : true
  },
  Adresse: {
    type : String,
    // required : true 
  },
  agenceName:{
    type:String,
  },

}, { timestamps: true })
module.exports=mongoose.model('BlackList',BlackListSchema);
