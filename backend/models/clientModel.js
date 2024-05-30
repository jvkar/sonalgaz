const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const ClientSchema= new Schema({
    nomClient:
    { 
        type:String,
    } ,
    adresseClient : {
        type : String,

    },
    codeClient:{
        type : Number,
        // required: true,
        unique:true
    },
    referenceClient : {
        type : Number,
        unique:true
    },
    numeroCompteur:{
        type : Number ,
    },
    typeClient : { 
        type: String,
    },
    etat:{
        type : String,
        default:"en attente"
    },
    date_signale:{
        type : Date,
        default:null

    },
    cause:{
        type:String,
        default:null
    },
    archived:{
        type:String,
        default:"Non Archiver"
    },
    entrepriseId:{
        type : Schema.Types.ObjectId,
        ref: 'Etablissement',
        default:null
    },
    listId:{
        type : Schema.Types.ObjectId,
        ref: 'ListIntervention',
        default : null
    },
    agence:{
        type : Schema.Types.ObjectId,
        ref: 'Agence',
        default:null,
    },
    technicienId:{
        type : Schema.Types.ObjectId,
        ref:'Technicien',
        default:null
    }
    
    
}, { timestamps: true })
module.exports=mongoose.model('Client',ClientSchema);
