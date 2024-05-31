const { default: mongoose } = require('mongoose');
const Etablissement =require('../models/etablissementModel')
const Client = require('../models/clientModel')
const BlackList=require('../models/BlackListModel')
const Technicien = require('../models/technicienModel')
const Agence=require('../models/agenceModel')
const ResponsableEntreprise= require('../models/responsableEntreprise')
const ListInterventions = require('../models/ListeInterventionModel')
const csvtojson =require ('csvtojson');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const BlackListModel = require('../models/BlackListModel');
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

// const addManyEtablissements = async (req,res)=>{
//   const csvfilepath = __dirname +'/../filesEtablissements/'+req.file?.originalname;
//   try {
    
//     const csvData = await csvtojson().fromFile(csvfilepath);
//     const agences = await Agence.find({state:"active"});
//     if (agences.length === 0) {
//       return res.status(500).json({ error: "Il faut insérer la liste des agences." });
//     }
//     const etablissements = await Etablissement.insertMany(csvData);
//     const agenceOne= await Agence.findOne();
//     const nbr = agenceOne ? agenceOne.numeroEntreprisesParAgence : null;
//     const {NombreDesCoupures}=req.body
//     if(NombreDesCoupures==""){
//      return res.status(500).json({error:" tous les champs doit etre remplis "})
//     }

//     if (etablissements.length === 0 || (agences.length > 0 && agences[0].etablissements?.length === 0)) {
//       agenceIndex = 0;
//       usedAgenceIds.clear();
//     }

//     for (let i = 0; i < etablissements.length; i++) {
//       const etablissementsNumberUpdate= await Etablissement.find({NombreDesCoupures:0});
//       for(const etablissements of etablissementsNumberUpdate ){
//             await Etablissement.findByIdAndUpdate(etablissements._id,{NombreDesCoupures:NombreDesCoupures})
//       }
//     }
//     agenceIndex = agenceIndex || 0;
//     for (let i = 0; i < etablissements.length; i+=nbr) {
//       const agenceId = agences[agenceIndex % agences.length]._id

//       while (usedAgenceIds.has(agenceId)) {
//         agenceIndex++;
//       }
//       const etablissementsToUpdate = await Etablissement.find({ agence: null}).limit(nbr);

//       for (const etablissement of etablissementsToUpdate) {
//         await Etablissement.findByIdAndUpdate(etablissement._id, { agence: agenceId });
//         usedAgenceIds.add(agenceId);
//       }
//       agenceIndex++;
//     }

//     res.json({ success: "success" });
  

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }
const addManyEtablissements = async (req, res) => {
  const csvfilepath = __dirname +'/../filesEtablissements/'+req.file?.originalname;
  try {
    const csvData = await csvtojson().fromFile(csvfilepath);
    const agences = await Agence.find({ state: "active" });

    if (agences.length === 0) {
      return res.status(500).json({ error: "Il faut insérer la liste des agences." });
    }

    const etablissements=await Etablissement.insertMany(csvData);

    const agenceOne = await Agence.findOne();
    const nbr = agenceOne ? agenceOne.numeroEntreprisesParAgence : null;
    const { NombreDesCoupures } = req.body;

    if (NombreDesCoupures === "") {
      return res.status(500).json({ error: "Tous les champs doivent être remplis." });
    }


    await Etablissement.updateMany({ NombreDesCoupures: 0 }, { NombreDesCoupures });

    let etablissementsToUpdate = await Etablissement.find({ agence: null }).limit(nbr);


    for (let i = 0; i < csvData.length; i += nbr) {
      const agenceId = agences[agenceIndex % agences.length]._id;

      for (const etablissement of etablissementsToUpdate) {
        await Etablissement.findByIdAndUpdate(etablissement._id, { agence: agenceId });
      }

      etablissementsToUpdate = await Etablissement.find({ agence: null }).limit(nbr);


      agenceIndex++;
    }

    res.json(etablissements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addToBlackList = async (req, res) => {
  const { id } = req.params;
  const etablissement = await Etablissement.findOne({ _id: id });

  if (!etablissement) {
    return res.status(404).json({ error: "Etablissement not found" });
  }

  const agenceName = await Agence.findOne({ _id: etablissement.agence });
  const { Nom, NumeroEtablissement, Adresse, agence,etat,timesInBlackList } = etablissement.toObject();

  let newBlackListEntry;

  const blackListEntry = await BlackList.findOne({ entreprise: id });

  if (blackListEntry) {
    const etab = await Etablissement.findOne({ _id: blackListEntry.entreprise });
    const newTimesInBlackList = etab.timesInBlackList + 1;
    await Etablissement.updateOne({ _id: id }, { timesInBlackList: newTimesInBlackList });
    newBlackListEntry = await BlackList.findOneAndUpdate(
      { entreprise: id },
      {
        Nom,
        NumeroEtablissement,
        Adresse,
        agence,
        etat,
        timesInBlackList,
        agenceName: agenceName?.nom,
        entreprise: id
      },
      { new: true } // To return the modified document
    );
    return res.status(200).json(newBlackListEntry);
  } else {
    await BlackList.create({
      Nom,
      NumeroEtablissement,
      Adresse,
      agence,
      etat,
      timesInBlackList,
      agenceName: agenceName?.nom,
      entreprise: id
    });
    await Etablissement.updateOne({ _id: id }, { timesInBlackList: 1 });
    newBlackListEntry = await BlackList.findOne({ entreprise: id });
    return res.status(200).json(newBlackListEntry);
  }

};

const getBlackList =async(req,res)=>{
  const {id} = req.params
  try{
    const blackList=await BlackList.find({agence:id,etat:"Non Archiver"})
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
  const etablissement=await Etablissement.find({agence:id,etat:"Non Archiver"}).sort({NumeroEtablissement:1})
  res.status(200).json(etablissement)
  }catch(error){
   res.status(400).json({error:'the error is here'})
  }
}
//get all Etablissements
const getAllEtablissement = async (req, res) => {
  try {
    const etablissements = await Etablissement.find({etat:"Non Archiver"}).sort({ NumeroEtablissement: 1 });
    res.status(200).json(etablissements);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//create etablissement
const createEtablissement= async (req, res) => {
    const {Nom,NumeroEtablissement,Adresse,NombreDesCoupures,numeroAgence} = req.body
    
    try {
      const agence = await Agence.findOne({numeroAgence:numeroAgence})
      const etablissement = await Etablissement.create({Nom,NumeroEtablissement,Adresse,NombreDesCoupures,agence:agence._id})
      res.status(200).json(etablissement)
    } catch (error) {
      res.status(400).json({error: error.message})
    }
  }
//creer des comptes pour les entreprises
const createAccount=async(req,res)=>{
  try {
  const {nomResponsable,NumeroEtablissement,username, password} = req.body
  const etablissement= await Etablissement.findOne({NumeroEtablissement:NumeroEtablissement})
  if(!etablissement){
      res.status(400).json({error:"n'existe pas une entreprise avec ce numero"})
  }
  if(etablissement){
    const responsableEntreprise = await ResponsableEntreprise.createAccountEtab(nomResponsable,NumeroEtablissement,username, password,etablissement._id)
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
const deleteEtablissement = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const listInterventions = await ListInterventions.findOne({ entrepriseId: id });

    if (listInterventions !== null) {
      return res.status(400).json({ error: "You cannot delete this entreprise because it has associated interventions" });
    }

    const etablissement = await Etablissement.findOneAndDelete({ _id: id });

    if (!etablissement) {
      return res.status(404).json({ error: "Etablissement not found" });
    }

    return res.status(200).json(etablissement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

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
  const changePassword  = async (req,res) =>{
    const { username, password,newPassword,confirmedPassword } = req.body;
    try { 
       const user = await ResponsableEntreprise.changePassword(username,password,newPassword,confirmedPassword)

           return res.status(200).json({message:"le mot de pass est change avec succes"})
 
    } catch (error) {
        return res.status(400).json({error:error.message})
    }
  }
  const getNumberOfEtablissements = async (req,res) =>{
    try{
      const etablissements = await Etablissement.find({})
      if(etablissements){
        const etablissementsLength = etablissements.length
        res.status(200).json(etablissementsLength)
      }
    }catch(error){
      res.status(400).json({error:error.message})
    }
  }
  const getNumberOfEtablissementsPerAgence = async(req,res)=>{
    const {id} = req.params
    try{
      const etablissements= await Etablissement.find({agence:id})
      if(etablissements){
        const etablissementLength = etablissements.length
        res.status(200).json(etablissementLength)
      }
    }catch(error){
      res.status(400).json({error:error.message})
    }
  }
  const archiverEntreprise= async(req,res)=>{
   const {id} = req.params
   try{
    const entreprise=await Etablissement.findOneAndUpdate({_id:id,etat:"Non Archiver"},
    {etat:"archiver"},
    { new: true }
  )
  await BlackList.findOneAndUpdate({entreprise:id,etat:"Non Archiver"},
  {etat:"archiver"},
  { new: true }
  )
  await Technicien.findOneAndDelete({entrepriseId:id})
  const clients= await Client.find({entrepriseId:id,archived:"Non Archiver"})
  for(const client of clients){
    await Client.findByIdAndUpdate(client._id,
      {archived:"archiver"})
  }
  await ResponsableEntreprise.findOneAndDelete({etablissement:id});
  res.status(200).json(entreprise)
   }catch(error){
    res.status(400).json({error:error.message})

   }
  }
  const archiverToutLesEntreprises = async (req, res) => {
    try {
      updatedEntreprises= await Etablissement.updateMany({ etat: "Non Archiver" }, { etat: "archiver" });
      await BlackList.updateMany({ etat: "Non Archiver" }, { etat: "archiver" })
      await Technicien.deleteMany({})

      const entreprises = await Etablissement.find({ etat: "archiver" });
      const updatePromises = entreprises.map(async (entreprise) => {
        await Client.updateMany({ entrepriseId: entreprise._id, archived: "Non Archiver" }, { archived: "archiver" });
      });
      await Promise.all(updatePromises);
  
      res.status(200).json(updatedEntreprises);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  const nombreDesEntreprisesListeNoire=async(req,res)=>{
    const {id} = req.params
    try{
      const Blacklist = await BlackList.find({agence:id})
      const BlackListNumber= Blacklist.length
      res.status(200).json(BlackListNumber);

    }catch(error){
      res.status(500).json({error:error.message});

    }
  }
  const nombreEntreprisesArchiver= async(req,res)=>{
    const {id} = req.params

    try{
      const EntrepriseArchiver = await Etablissement.find({agence:id,etat:"archiver"}) 
      res.status(200).json(EntrepriseArchiver)
    }catch(error){
      res.status(500).json({error:error.message})
    } 
  }
  const getArchivedEntreprises = async (req,res)=>{
    try{
      const entreprises= await Etablissement.find({etat:"archiver"});
      if(entreprises){
        return res.status(200).json(entreprises);
      }
      else{
        return res.status(500).json({message:"il n ya pas des entreprises archives"});
      }
    }catch(error){
        return res.status(500).json({error:error.message});
    }
  }
    const notifications = async (entrepriseId) => {
      try {
        const limit = await Client.find({ typeClient: "coupure", entrepriseId, etat: { $ne: "en attente" } });
        const totalCoupures = await Client.find({ typeClient: "coupure", entrepriseId });
    
        if (limit.length === totalCoupures.length) {
          const entreprise = await ResponsableEntreprise.findOne({etablissement:entrepriseId});
          if (!entreprise) {
            throw new Error('Entreprise not found');
          }
    
          entreprise.notfications.push({ message: "Limit reached notification message" });
          await entreprise.save();
          console.log("success")
          return { success: true, message: "Notification added" };
        } else {
          return { success: false, message: "Limit not reached, no notification added" };
        }
      } catch (error) {
        throw new Error(error.message);
      }
    };
    
  const getNotfications = async (req, res) => {
    const { id } = req.params;
  
    try {
      const responsable = await ResponsableEntreprise.findOne({etablissement:id});
      
      if (!responsable) {
        return res.status(404).send('responsable not found');
      }
  
      res.json(responsable.notfications);
    } catch (error) {
      res.status(500).send(error);
    }
  };
  
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
    ,changePassword
    ,getNumberOfEtablissements
    ,getNumberOfEtablissementsPerAgence
    ,archiverEntreprise
    ,archiverToutLesEntreprises
    ,nombreDesEntreprisesListeNoire
    ,nombreEntreprisesArchiver
    ,getArchivedEntreprises
    ,notifications
    ,getNotfications
}