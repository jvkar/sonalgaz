const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const notificationSchema = new mongoose.Schema({
  message: String,
  date: { type: Date, default: Date.now }
});
const TechnicienSchema = new Schema({
    nomTechnicien: {
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
    nbrInterventions :{
      type:Number,
    },

    username: {
        type: String,
        unique: true,

    }
    , password: {
        type: String,
    }
    ,notfications:{
      type : [notificationSchema],
      default:[]
    }
})
//signup
TechnicienSchema.statics.createAccountTechnicien = async function(nomTechnicien,codeTechnicien,nbrInterventions, username,password,entrepriseId) {

    const exists = await this.findOne({ username })
  
    if (exists) {
      throw Error('username deja exister')
    }
  
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
  
    const technicien = await this.create({ nomTechnicien,codeTechnicien,nbrInterventions,username, password: hash,entrepriseId })
  
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
  TechnicienSchema.statics.changePassword = async function (username, password, newPassword, confirmedPassword) {
    if (username === "" || password === "" || newPassword === "" || confirmedPassword === "") {
        throw Error('Tous les champs doivent être remplis');
    }

    const technicien = await this.findOne({ username });
    if (!technicien) {
        throw Error('Utilisateur non trouvé');
    }

    const match = await bcrypt.compare(password, technicien.password);
    if (!match) {
        throw Error('Le mot de passe est incorrect');
    }

    if (newPassword === password) {
        throw Error('Veuillez entrer un nouveau mot de passe différent de l\'ancien');
    }

    if (newPassword !== confirmedPassword) {
        throw Error('La confirmation du mot de passe est incorrecte');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
 
    technicien.password = hashedPassword;
    await technicien.save();
    return technicien
};
 module.exports=mongoose.model('Technicien',TechnicienSchema);