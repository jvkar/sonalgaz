const mongoose=require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const AdminSchema =new Schema({
    username:{
    type: String,
    unique: true,
     
    }
    ,password:{
        type : String,
     
     
    },


    
})
//signup
AdminSchema.statics.createAccount = async function(username, password) {

    const exists = await this.findOne({ username })
  
    if (exists) {
      throw Error('username deja exister')
    }
  
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
  
    const admin = await this.create({ username, password: hash })
  
    return admin
  }
  //login
  AdminSchema.statics.login = async function(username, password) {

    if ( !username || !password) {
      throw Error('tous les champs doit etre remplis')
    }
  
    const admin = await this.findOne({ username })
    if (!admin) {
      // throw Error("l'identificateur est incorrect")
      return null
    }
  
    const match = await bcrypt.compare(password, admin.password)
    if (!match) {
      // throw Error('le mot de pass est incorrect')
      return null
    }
  
    return admin
  }
 module.exports=mongoose.model('Admin',AdminSchema);