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
    },
    referenceClient : {
        type : Number,
    },
    numeroCompteur:{
        type : Number ,
    },
    typeClient : { 
        type: String,
    },
    etat:{
        type : String,
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
    }
    
    
}, { timestamps: true })
module.exports=mongoose.model('Client',ClientSchema);
