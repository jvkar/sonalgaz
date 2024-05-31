const mongoose=require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const notificationSchema = new mongoose.Schema({
  message: String,
  date: { type: Date, default: Date.now }
});
const ResponsableEntrepriseSchema =new Schema({
    nomResponsable : {
        type : String ,
        required:true
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
    },
    notfications:{
      type : [notificationSchema],
      default:[]
    }


    
})
//signup
ResponsableEntrepriseSchema.statics.createAccountEtab = async function(nomResponsable,NumeroEtablissement,username, password,etablissement) {

    const exists = await this.findOne({ username })
  
    if (exists) {
      throw Error('username deja exister')
    }
  
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
  
    const responsableEntreprise = await this.create({nomResponsable, NumeroEtablissement,username, password: hash,etablissement })
  
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
  ResponsableEntrepriseSchema.statics.changePassword = async function (username, password, newPassword, confirmedPassword) {
    if (username === "" || password === "" || newPassword === "" || confirmedPassword === "") {
        throw Error('Tous les champs doivent être remplis');
    }

    const responsableEntreprise = await this.findOne({ username });
    if (!responsableEntreprise) {
        throw Error('Utilisateur non trouvé');
    }

    const match = await bcrypt.compare(password, responsableEntreprise.password);
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
    
 
    responsableEntreprise.password = hashedPassword;
    await responsableEntreprise.save();
    return responsableEntreprise
};
 module.exports=mongoose.model('ResponsableEntreprise',ResponsableEntrepriseSchema);