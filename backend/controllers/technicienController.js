const { default: mongoose } = require('mongoose');
const Etablissement =require('../models/etablissementModel')
const Technicien = require('../models/technicienModel')
const jwt = require('jsonwebtoken')
const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}
const createAccount=async(req,res)=>{

    const {id} = req.params
    try {
  
  
      const {nomTechnicien,codeTechnicien,nbrInterventions,username, password} = req.body

     if(nomTechnicien=="" && codeTechnicien =="" && nbrInterventions==""&& username =="" && password ==""){
        return res.status(400).json({error:"tout les champs doit etre remplis"})
     }

        const technicien = await Technicien.createAccountTechnicien(nomTechnicien, codeTechnicien,nbrInterventions,username, password,id);
  
      const token = createToken(technicien._id)
      res.status(200).json({username, token})
      

    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
const getTechnicienById = async(req,res)=>{
    const {id} = req.params
    try{
        const techniciens =await Technicien.find({entrepriseId:id})
        if(!techniciens){
             return res.status(400).json("there s no available techniciens")
        }
        else{
         return res.status(200).json(techniciens)
        }
    }catch(error){
        res.status(404).json({error:error.message})
    }
};
const affecterCoupureTechnicien = async(req,res) =>{

}
  module.exports={
    createAccount
    ,getTechnicienById
  }