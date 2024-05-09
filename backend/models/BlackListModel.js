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
  agence:{type: Schema.Types.ObjectId,
    ref:'Agence',
    default : null    
  },
  etat:{
    type:String,
    default:'Non Archiver'
  },
  timesInBlackList:{
    type:Number,
    default:null,
  },
  entreprise:{
    type: Schema.Types.ObjectId,
    ref:'Etablissement',
    default : null    
  },
  agenceName:{
    type:String,
  },

}, { timestamps: true })
module.exports=mongoose.model('BlackList',BlackListSchema);
