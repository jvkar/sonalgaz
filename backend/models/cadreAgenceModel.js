const mongoose=require('mongoose');
const bcrypt = require('bcrypt');
const validator=require('validator')
const Schema = mongoose.Schema;
const CadreAgenceSchema =new Schema({
    Nom : {
        type : String ,
    },
    numeroAgence:{
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
    
    agence :{type: Schema.Types.ObjectId,
        ref:'Agence',

    }


    
})
//signup
CadreAgenceSchema.statics.createAccountAgence = async function(numeroAgence,username, password,agence) {
    if(!username || !password || !numeroAgence){
        throw Error("tous les champs doit etre rempli")
    }
    if(!validator.isStrongPassword){
        throw Error("le mot de pass doit contenir maj et min et nombre et symb");
    }
    const exists = await this.findOne({ username })
  
    if (exists) {
      throw Error('username deja exister')
    }
  
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
  
    const cadreAgence = await this.create({ numeroAgence,username, password: hash,agence })
  
    return cadreAgence
  }
  //login
  CadreAgenceSchema.statics.login = async function(username, password) {

    if (!username || !password) {
      throw Error('tous les champs doit etre remplis')
    }
  
    const cadreAgence = await this.findOne({ username })
    if (!cadreAgence) {
    return null
    }
  
    const match = await bcrypt.compare(password, cadreAgence.password)
    if (!match) {
    return null
    }
  
    return cadreAgence
  }
  CadreAgenceSchema.statics.changePassword = async function (username, password, newPassword, confirmedPassword) {
    if (username === "" || password === "" || newPassword === "" || confirmedPassword === "") {
        throw Error('Tous les champs doivent être remplis');
    }

    const cadreAgence = await this.findOne({ username });
    if (!cadreAgence) {
        throw Error('Utilisateur non trouvé');
    }

    const match = await bcrypt.compare(password, cadreAgence.password);
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
    
 
    cadreAgence.password = hashedPassword;
    await cadreAgence.save();
    return cadreAgence
};
 module.exports=mongoose.model('CadreAgence',CadreAgenceSchema);