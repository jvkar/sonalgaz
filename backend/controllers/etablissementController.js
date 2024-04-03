const { default: mongoose } = require('mongoose');
const Etablissement =require('../models/etablissementModel')
const BlackList=require('../models/BlackListModel')
const Agence=require('../models/agenceModel')
const ResponsableEntreprise= require('../models/responsableEntreprise')
const csvtojson =require ('csvtojson');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken')
const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}
// const mime = require('mime-types');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, path.join(__dirname, '..', '/filesEtablissements'));
  },
  filename: function(req, file, cb) {
      cb(null,file.originalname);
  }
});


const upload = multer({storage}).single('file');
const usedAgenceIds = new Set();
let agenceIndex = 0;

const addManyEtablissements = async (req,res)=>{
  const csvfilepath = __dirname +'/../filesEtablissements/'+req.file?.originalname;
  try {
    
    const csvData = await csvtojson().fromFile(csvfilepath);
    const agences = await Agence.find({state:"active"});
    if (agences.length === 0) {
      return res.status(500).json({ error: "Il faut insérer la liste des agences." });
    }
    const etablissements = await Etablissement.insertMany(csvData);
    const agenceOne= await Agence.findOne();
    const nbr = agenceOne ? agenceOne.numeroEntreprisesParAgence : null;
    const {NombreDesCoupures}=req.body
    if(NombreDesCoupures==""){
     return res.status(500).json({error:" tous les champs doit etre remplis "})
    }

    if (etablissements.length === 0 || (agences.length > 0 && agences[0].etablissements?.length === 0)) {
      agenceIndex = 0;
      usedAgenceIds.clear();
    }

    for (let i = 0; i < etablissements.length; i++) {
      const etablissementsNumberUpdate= await Etablissement.find({NombreDesCoupures:0});
      for(const etablissements of etablissementsNumberUpdate ){
            await Etablissement.findByIdAndUpdate(etablissements._id,{NombreDesCoupures:NombreDesCoupures})
      }
    }
    agenceIndex = agenceIndex || 0;
    for (let i = 0; i < etablissements.length; i+=nbr) {
      const agenceId = agences[agenceIndex % agences.length]._id

      while (usedAgenceIds.has(agenceId)) {
        agenceIndex++;
      }
      const etablissementsToUpdate = await Etablissement.find({ agence: null}).limit(nbr);

      for (const etablissement of etablissementsToUpdate) {
        await Etablissement.findByIdAndUpdate(etablissement._id, { agence: agenceId });
        usedAgenceIds.add(agenceId);
      }
      agenceIndex++;
    }

    res.json({ success: "success" });
  

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
const addToBlackList = async (req, res) => {
  const { id } = req.params;
  const etablissement = await Etablissement.findOne({ _id: id });

  if (!etablissement) {
    return res.status(404).json({ error: "Etablissement not found" });
  }

  const agenceName = await Agence.findOne({ _id: etablissement.agence });
  const { Nom, NumeroEtablissement, Adresse, agence } = etablissement.toObject();


  const blackListEntry = await BlackList.findOne({ entreprise: id });

  if (blackListEntry) {

    const etab = await Etablissement.findOne({_id:blackListEntry.entreprise})
    const newTimesInBlackList = etab.timesInBlackList + 1;
    await Etablissement.updateOne({ _id: id }, { timesInBlackList:newTimesInBlackList });
  } else {

 
    await BlackList.create({
      Nom,
      NumeroEtablissement,
      Adresse,
      agence,
      agenceName: agenceName?.nom,
      entreprise: id
    });
    await Etablissement.updateOne({ _id: id }, { timesInBlackList: 1 });
    return res.json({message: "added"})
  }

  res.json({ message: "Operation completed successfully" });
};
const getBlackList =async(req,res)=>{
  const {id} = req.params
  try{
    const blackList=await BlackList.find({agence:id})
    if(!blackList){
      return res.status(400).json("Empty List")
    }
    if(blackList)
     return res.status(200).json(blackList)

  }catch(error){
    return res.status(500).json("error Internal Server")
  }

}
const getFromBlackList=async(req,res)=>{
  const {id}=req.params
  const blackList=await BlackList.findOne({_id:id})
  const {Nom,NumeroEtablissement,Adresse}=blackList.toObject()
  if(blackList){
    const etablissement=await Etablissement.create({Nom,NumeroEtablissement,Adresse})
    await BlackList.findOneAndDelete({_id:id})
    res.json(etablissement)
  }
  else {
    res.status(404).json({error:"error"});
  }
}
// const addManyEtablissements = async (req, res) => {
//   const csvfilepath = __dirname + '/../filesEtablissements/' + req.file?.originalname;
//   try {
//     const csvData = await csvtojson().fromFile(csvfilepath);
//     const etablissements = await Etablissement.insertMany(csvData);
//     const agences = await Agence.find({});
//     let agenceIndex = 0;

//     for (let i = 0; i < etablissements.length; i += 20) {
//       const agenceId = agences[agenceIndex % agences.length]._id;

//       const etablissementsToUpdate = await Etablissement.find({ agence: null }).limit(20);

//       for (const etablissement of etablissementsToUpdate) {
//         await Etablissement.findByIdAndUpdate(etablissement._id, { agence: agenceId });
//       }

//       agenceIndex++;
//     }

//     res.json({ success: "success" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
const agencePerEntreprise= async(req,res)=>{
  const {id}=req.params
  try{
  const etablissement=await Etablissement.find({agence:id}).sort({NumeroEtablissement:1})
  res.status(200).json(etablissement)
  }catch(error){
   res.status(400).json({error:'the error is here'})
  }
}
//get all Etablissements
const getAllEtablissement = async (req,res)=>{
   try{ const etablissements= await Etablissement.find({}).sort({NumeroEtablissement:1})
     

        res.status(200).json(etablissements);
        
 
   } catch (error) {
       console.error(error);
       res.status(500).json({ error: 'Internal Server Error' });
   }

}
//create etablissement
const createEtablissement= async (req, res) => {
    const {Nom,NumeroEtablissement,Adresse,NombreDesCoupures} = req.body
    
    try {
      const etablissement = await Etablissement.create({Nom,NumeroEtablissement,Adresse,NombreDesCoupures})
      res.status(200).json(etablissement)
    } catch (error) {
      res.status(400).json({error: error.message})
    }
  }
//creer des comptes pour les entreprises
const createAccount=async(req,res)=>{
  try {
  const {NumeroEtablissement,username, password} = req.body
  const etablissement= await Etablissement.findOne({NumeroEtablissement:NumeroEtablissement})
  if(!etablissement){
      res.status(400).json({error:"n'existe pas une entreprise avec ce numero"})
  }
  if(etablissement){
    const responsableEntreprise = await ResponsableEntreprise.createAccountEtab(NumeroEtablissement,username, password,etablissement._id)
    const token = createToken(responsableEntreprise._id)
    res.status(200).json({username, token})

  }
} catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const deleteAllEtablissements=async(req,res)=>{
  try{
    const etablissements=await Etablissement.deleteMany({});
    res.status(200).json(etablissements);
  }catch(error){
    res.status(400).json({error:json.error});
  }
}
const deleteEtablissement =async(req,res)=>{
  const {id}=req.params
  try{
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({error:"entreprise n'existe pas"});
    }
    const etablissement=await Etablissement.findByIdAndDelete({_id:id})
    res.status(200).json(etablissement)
    if(!etablissement){
      res.status(400).json({erorr:"l'entreprise n'existe pas"})
    }
  }
  catch(error){
    res.status(400).json({error:json.error})
  }

  }
  const updateEtablissemenet=async(req,res)=>{
    const {id}=req.params
    const {Nom,NumeroEtablissement,Adresse}=req.body
    try {
      if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:"entreprise n'existe pas"});
      }
    const existingEtablissementByName = await Etablissement.findOne({ Nom });
    if (existingEtablissementByName && existingEtablissementByName._id != id) {
      return res.status(400).json({ error: "An etablissement with this name already exists" });
    }

    const existingEtablissementByNumber = await Etablissement.findOne({ NumeroEtablissement });
    if (existingEtablissementByNumber && existingEtablissementByNumber._id != id) {
      return res.status(400).json({ error: "An etablissement with this number already exists" });
    }
    if(Nom==""&&NumeroEtablissement==""&&Adresse==""){
      return res.status(400).json({error:"tout les champs doit etre remplis"})
    }

      const etablissement =await Etablissement.findByIdAndUpdate({_id:id},
        {Nom:Nom,NumeroEtablissement:NumeroEtablissement,Adresse:Adresse}
        )
      const updatedEtablissement=etablissement.save();
      if(!etablissement){
       res.status(400).json("etablissement n'existe pas");
      }
      if(etablissement){
        res.status(200).json(updatedEtablissement);
      }
    
    }catch(error){
      res.status(400).json({error:error.message})
    }
  }


module.exports={
    getAllEtablissement,
    createEtablissement,
    upload,addManyEtablissements,
    agencePerEntreprise,
    addToBlackList,
    getBlackList,
    getFromBlackList,
    createAccount
    ,deleteAllEtablissements
    ,deleteEtablissement
    ,updateEtablissemenet

}