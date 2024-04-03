const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const TechnicienSchema = new Schema({
    nomTechnicient: {
        type: String,
    }
    ,
    codeTechnicien: {
        type: Number
    },
    entrepriseId: {
        type: Schema.Types.ObjectId,
        ref: 'Etablissement',
        default:null,
    },
    username: {
        type: String,
        unique: true,

    }
    , password: {
        type: String,
    }
})
//signup
TechnicienSchema.statics.createAccountTechnicien = async function(nomTechnicient,codeTechnicien, username,password,entrepriseId) {

    const exists = await this.findOne({ username })
  
    if (exists) {
      throw Error('username deja exister')
    }
  
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
  
    const technicien = await this.create({ nomTechnicient,codeTechnicien,username, password: hash,entrepriseId })
  
    return technicien
  }
  //login
  TechnicienSchema.statics.login = async function(username, password) {

    if ( !username || !password) {
      throw Error('tous les champs doit etre remplis')
    }
  
    const technicien = await this.findOne({ username })
    if (!technicien) {
      // throw Error("l'identificateur est incorrect")
    return null
    }
  
    const match = await bcrypt.compare(password, technicien.password)
    if (!match) {
      // throw Error('le mot de pass est incorrect')
    return null
    }
  
    return technicien
  }
 module.exports=mongoose.model('Technicien',TechnicienSchema);