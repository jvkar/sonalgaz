const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const factureSchema=new Schema({

    Numero:
    {
        type: Number,
        // required:true,
        unique:true
    },
    NumeroClient : 
    {
        type : Number,
        required : true,
    },
    file2:{
        type : String

    },
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
    
}, { timestamps: true })
module.exports=mongoose.model('Facture',factureSchema);