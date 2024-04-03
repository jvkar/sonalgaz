const mongoose=require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const ResponsableEntrepriseSchema =new Schema({
    Nom : {
        type : String ,
    },
    NumeroEtablissement:{
        type: Number,
        required:true
    },
    username:{
    type: String,
    unique: true,
     
    }
    ,password:{
        type : String,
    },
    etablissement :{
      type: Schema.Types.ObjectId,
        ref:'Etablissement',
    }


    
})
//signup
ResponsableEntrepriseSchema.statics.createAccountEtab = async function(NumeroEtablissement,username, password,etablissement) {

    const exists = await this.findOne({ username })
  
    if (exists) {
      throw Error('username deja exister')
    }
  
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
  
    const responsableEntreprise = await this.create({ NumeroEtablissement,username, password: hash,etablissement })
  
    return responsableEntreprise
  }
  //login
  ResponsableEntrepriseSchema.statics.login = async function(username, password) {

    if ( !username || !password) {
      throw Error('tous les champs doit etre remplis')
    }
  
    const responsableEntreprise = await this.findOne({ username })
    if (!responsableEntreprise) {
      // throw Error("l'identificateur est incorrect")
    return null
    }
  
    const match = await bcrypt.compare(password, responsableEntreprise.password)
    if (!match) {
      // throw Error('le mot de pass est incorrect')
    return null
    }
  
    return responsableEntreprise
  }
 module.exports=mongoose.model('ResponsableEntreprise',ResponsableEntrepriseSchema);