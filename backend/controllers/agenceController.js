const { default: mongoose } = require('mongoose');
const Agence =require('../models/agenceModel')
const CadreAgence= require('../models/cadreAgenceModel')
const Etablissement=require('../models/etablissementModel')
const csvtojson =require ('csvtojson');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken')
const { AxiosHeaders } = require('axios');
const { json } = require('express');


const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}


const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, path.join(__dirname, '..', '/filesAgences'));
  },
  filename: function(req, file, cb) {
      cb(null,file.originalname);
  }
});


const upload = multer({storage}).single('file');
const addManyAgences = async (req,res)=>{
  const csvfilepath = __dirname +'/../filesAgences/'+req.file?.originalname;
  try {
    const {numeroEntreprisesParAgence}=req.body
    const csvData = await csvtojson().fromFile(csvfilepath);
    const agences = await Agence.insertMany(csvData);
    
    for (let i = 0; i < agences.length; i++) {
      const agencesNumberUpdate= await Agence.find({numeroEntreprisesParAgence:0});
      for(const agence of agencesNumberUpdate ){
        await Agence.findByIdAndUpdate(agence._id,{numeroEntreprisesParAgence:numeroEntreprisesParAgence})
      }
      // const agenceId = agences[i]._id;
      // const etablissementsToUpdate = await Etablissement.find({ agence: null }).limit(Agence.numeroEntreprisesParAgence);
      // for (const etablissement of etablissementsToUpdate) {
      //   await Etablissement.findByIdAndUpdate(etablissement._id, { agence: agenceId });
      // }
    }
    
    res.json({ success: "success" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getAllAgences = async (req,res)=>{
    
    try{ const agences= await Agence.find({}).sort({numeroAgence:1})

    if(!agences){
      return res.status(500).json({error:"there s no agences"})
    }     
    res.status(200).json(agences);
         
  
    } catch (error) {

      res.status(500).json({ error: 'Internal Server Error' });
      
    }
 }
const entrepriseParAgence= async  (req, res) => {
  const {id}=req.params
  try{
  const etablissement=await Etablissement.find({agence:id}) 
  
  if(etablissement){
  res.status(200).json(etablissement)
  }
  else{
    res.status(500).json('entreprise not found')
  }
  }catch(error){
    res.status(400).json({error:'here the prob'})
  }
  
}
const entrepriseParCadre = async (req, res) => {
  const {id} = req.params
  const cadreAgence = await CadreAgence.findOne({_id:id});

  const agence = cadreAgence.agence
  if(cadreAgence){
  
  try {

    const etabs = await Etablissement.find({ agence: agence });
    res.status(200).json(etabs);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
};
// ajouter agence 
const createAgence=async (req,res)=>{

        const{nom,numeroAgence,adresseAgence,numeroEntreprisesParAgence}=req.body
        try {
        const agence= await Agence.create({nom,numeroAgence,adresseAgence,numeroEntreprisesParAgence}) 
        res.status(200).json(agence);
      
       }
       catch(error){
        res.status(400).json({error:error.message})

       }
}
const createAccount=async(req,res)=>{


  try {


    const {numeroAgence,username, password} = req.body
    const agence= await Agence.findOne({numeroAgence:numeroAgence})
 
    if(agence){
      const cadreAgence = await CadreAgence.createAccountAgence(numeroAgence, username, password,agence._id);

    const token = createToken(cadreAgence._id)
    res.status(200).json({username, token})
    }
    if(!agence){
     return res.status(400).json({error:"il ya pas une agence avec ce numero"})
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const deleteAllAgences=async(req,res)=>{
  try{
    const agences=await Agence.deleteMany({});
    res.status(200).json(agences);
  }catch(error){
    res.status(400).json({error:json.error});
  }
}
const deleteAgence =async(req,res)=>{
  const {id}=req.params
  try{
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({error:"agence n'existe pas"});
    }
    const agence=await Agence.findByIdAndDelete({_id:id})
    res.status(200).json(agence)
    if(!agence){
      res.status(400).json({erorr:"l'agence n'existe pas"})
    }
  }
  catch(error){
    res.status(400).json({error:json.error})
  }

  }
  const updateAgence=async(req,res)=>{
    const {id}=req.params
    const {nom,numeroAgence,adresseAgence}=req.body
    try {
      if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:"agence n'existe pas"});
      }
      const existingEAgenceByName = await Agence.findOne({ nom });
      if (existingEAgenceByName && existingEAgenceByName._id != id) {
        return res.status(400).json({ error: "An Agence with this name already exists" });
      }
  
      const existingAgenceByNumber = await Agence.findOne({ numeroAgence });
      if (existingAgenceByNumber && existingAgenceByNumber._id != id) {
        return res.status(400).json({ error: "An Agence with this number already exists" });
      }
  
      if(!nom==""&&!numeroAgence==""&&!adresseAgence==""){
      const agence =await Agence.findByIdAndUpdate({_id:id},
        {nom:nom,numeroAgence:numeroAgence,adresseAgence:adresseAgence}
        )
      const updatedAgence=agence.save();
      if(!agence){
       res.status(400).json("agence n'existe pas");
      }
      if(agence){
        res.status(200).json(updatedAgence);
      }
    }
    else{
      res.status(500).json({error:"tous les champs doit etre remplis"})
    }
    }catch(error){
      res.status(400).json({error:json.error})
    }
  }
  const etatAgence = async (req, res) => {
    const { id } = req.params;
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "L'agence n'existe pas." });
      }
  
      const agence = await Agence.findOne({ _id: id });
  
      if (!agence) {
        return res.status(404).json({ error: "L'agence n'existe pas." });
      }
  
      const newState =agence.state == "active" ? "inactive" : "active";
      
      await Agence.findByIdAndUpdate(id, { state: newState });
      const newAgence = await Agence.findOne({_id:id})
  
      res.status(200).json(newAgence);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Une erreur s'est produite." });
    }
  };

module.exports={
    getAllAgences,
    createAgence
    ,addManyAgences
    ,upload,entrepriseParAgence,
    createAccount
    ,deleteAgence
    ,deleteAllAgences
    ,updateAgence
    ,entrepriseParCadre
    ,etatAgence
}