const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const ListInterventionSchema = new Schema({
    entrepriseId:{
        type : Schema.Types.ObjectId,
        ref: 'Etablissement',
    },
    clients:[{
        _id:{
        type : Schema.Types.ObjectId,
        ref: 'Client', 
        },
        nomClient:{
          type:  String,
          default:null
        },
        codeClient:{  type:  Number,
            default:null
        },
        adresseClient: { type:  String,
            default:null
    },
        
    }],
    type:{
        type:String
    },
    iteration:{
        type:Number
    },
    archive:{
        type:String,
        default:"Non Archiver"
    }
}, { timestamps: true })
module.exports=mongoose.model('ListIntervention',ListInterventionSchema);