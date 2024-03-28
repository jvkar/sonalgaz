const { default: mongoose } = require('mongoose');
const Client=require('../models/clientModel');
const Etablissement=require('../models/etablissementModel')
const ListIntervention= require('../models/ListeInterventionModel')
const Facture=require('../models/factureModel')
const csvtojson =require ('csvtojson');
const multer = require('multer');
const path = require('path');
// const mime = require('mime-types');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, path.join(__dirname, '..', '/filesClients'));
  },
  filename: function(req, file, cb) {
      cb(null,file.originalname);
  }
});


const upload = multer({storage}).single('file');
const usedEtablissementId = new Set();
let etablissementIndex = 0;
const addManyClient = async (req,res)=>{
  const csvfilepath = __dirname +'/../filesClients/'+req.file?.originalname;
  const {id} = req.params

  try {
    
    const csvData = await csvtojson().fromFile(csvfilepath);
    const clients = await Client.insertMany(csvData);
    for ( const client of clients){
      await Client.findByIdAndUpdate(client._id,{agence:id})
    }
    // const etablissements = await Etablissement.find({});

    // if (clients.length === 0 || (etablissements.length > 0 && etablissements[0].clients?.length === 0)) {
    //   etablissementIndex = 0;
    //   usedEtablissementId.clear();
    // }


    // etablissementIndex = etablissementIndex || 0;
    // for (let i = 0; i < clients.length; i+=10) {
    //   const EtablissementId = etablissements[etablissementIndex % etablissements.length]._id

    //   while (usedEtablissementId.has(EtablissementId)) {
    //     etablissementIndex++;
    //   }
    //   const clientsToUpdate = await Client.find({ etablissement: null}).limit(10);

    //   for (const client of clientsToUpdate) {
    //     await Client.findByIdAndUpdate(client._id, { etablissement: EtablissementId });
    //     usedEtablissementId.add(EtablissementId);
    //   }
    //   etablissementIndex++;
    // }

    res.json({ success: "success" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
const getCoupures =  async (req,res)=>{
  const {id} = req.params
  try { 
    const coupures = await Client.find({agence:id,typeClient:'coupure'})
    res.status(200).json(coupures);
  }
  catch(error){
    res.status(400).json({error:error.message});
  }
}
const getRetablissements =  async (req,res)=>{
  const {id} = req.params
  try { 
    const retablissement = await Client.find({agence:id,typeClient:'retablissement'})
    res.status(200).json(retablissement);
  }
  catch(error){
    res.status(400).json({error:error.message});
  }
}
let coupureIterations = new Map();
let retablissementIterations = new Map();

const resetIterations = (id) => {
  coupureIterations.set(id, 0);
  retablissementIterations.set(id, 0);
};

const affecterCoupure = async (req, res) => {
  const { id } = req.params;
  try {
    if (!coupureIterations.has(id)) {
      resetIterations(id)
    }
    const iterationCoupure = coupureIterations.get(id) + 1;
    const entrep = await Etablissement.findOne({_id:id})
    const clients = await Client.find({ typeClient: 'coupure', listId: null,agence:entrep.agence }).limit(10);
    if(clients.length === 0){
      return res.status(404).json({ error: "There are no available clients." });
    }
    const nbrCoupure = entrep.affectationCoupure+10
    await Etablissement.updateOne({_id:id},{
      affectationCoupure:nbrCoupure
    })
    const clientIds = clients.map(client => client._id); 
    const clientNames = clients.map(client=>client.nomClient)
    const clientCodes = clients.map(client=>client.codeClient)
    const clientAddresses = clients.map(client=>client.adresseClient)
    
    const listIntervention = await ListIntervention.create({
      entrepriseId: id,
      clients: clientIds.map((clientId, index) => ({
        _id: clientId,
        nomClient: clientNames[index],
        codeClient: clientCodes[index],
        adresseClient: clientAddresses[index]
      })),
      type:'coupures',
      iteration: iterationCoupure
    });
    for(const client of clients){
      await Client.findByIdAndUpdate(client._id,{listId:listIntervention._id})
    }
    coupureIterations.set(id, iterationCoupure);
    return res.status(200).json({ success: true, listInterventions:[listIntervention] });  
  } catch (error) {
   return  res.status(400).json({ error: error.message });
  }
}

const affecterRetablissement = async (req, res) => {
  const { id } = req.params;
  try {
    if (!retablissementIterations.has(id)) {
      resetIterations(id) 
    }
    const iterationRetablissement = retablissementIterations.get(id) + 1;
    const entrep = await Etablissement.findOne({_id:id})
    const clients = await Client.find({ typeClient: 'retablissement', listId: null,agence:entrep.agence }).limit(10);
    if(clients.length === 0){
      return res.status(404).json({ error: "There are no available clients." });
    }
    const nbrRetablissement = entrep.affectationRetablissement+10
    await Etablissement.updateOne({_id:id},{
      affectationRetablissement:nbrRetablissement
    })
    
    const clientIds = clients.map(client => client._id); 
    const clientNames = clients.map(client=>client.nomClient)
    const clientCodes = clients.map(client=>client.codeClient)
    const clientAddresses = clients.map(client=>client.adresseClient)

    const listIntervention = await ListIntervention.create({
      entrepriseId: id,
      clients: clientIds.map((clientId, index) => ({
        _id: clientId,
        nomClient: clientNames[index],
        codeClient: clientCodes[index],
        adresseClient: clientAddresses[index]
      })),
      type:'retablissements',
      iteration: iterationRetablissement
    });
    for(const client of clients){
      await Client.findByIdAndUpdate(client._id,{listId:listIntervention._id})
    }
    retablissementIterations.set(id, iterationRetablissement);
    return res.status(200).json({ success: true, listInterventions:[listIntervention] });  
  } catch (error) {
   return  res.status(400).json({ error: error.message });
  }
}
const coupureParEtablissement=async (req,res)=>{
  const {id}=req.params
  try {
  const listClient=await ListIntervention.find({entrepriseId:id,type:'coupures'})
  res.status(200).json(listClient)    
  }
  catch(error){
    res.status(400).json({error:error.message});
  }
}
const retabParEtablissement=async (req,res)=>{
  const {id}=req.params
  try {
  const listClient=await ListIntervention.find({entrepriseId:id,type:'retablissements'})
  res.status(200).json(listClient)    
  }
  catch(error){
    res.status(400).json({error:error.message});
  }
}



const getClientByFacture=async(req,res)=>{
  try {
    const {NumClient}=req.params;
 
    const client =await Client.find({
      NumClient:NumClient,
      
    })
    

    res.status(200).json(client)
  }
  catch(error){
    console.error(error);
    res.status(500).json({error : 'Internal Server Error'});
  }
}
//get all clients
const getAllClient = async (req,res)=>{
   try{ const clients= await Client.find({})

        res.json(clients);
        
 
   } catch (error) {
       console.error(error);
       res.status(500).json({ error: 'Internal Server Error' });
   }

}
const deleteClient =async(req,res)=>{
  const {id}=req.params
  if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(404).json({error:'client doesnnot exist'});
  }

  const client= await Client.findOneAndDelete({_id:id});
  const facture =await Facture.findOneAndDelete({NumeroClient:client.NumClient})
  if(!client){
    return res.status(404).json({error:'client doesnnot exist'});
  }
  res.status(200).json({client,facture});

  
}
const deleteAllClient= async (req,res)=>{
  const client=await Client.deleteMany({})
  res.status(200).json({client});
}
const createClient= async (req, res) => {
    
    // const {file}=req.body
    
    // try {
    //   const client = await Client.create({file:(file&&file.path)||null})
    //   res.status(200).json(client)
    // } catch (error) {
    //   res.status(400).json({error: error.message})
    // }
  }
module.exports={
  deleteClient,
  getAllClient,
  createClient,
  getClientByFacture,
  addManyClient,
  upload,
  deleteAllClient,
  coupureParEtablissement,
  retabParEtablissement,
  getCoupures,
  getRetablissements,
  affecterCoupure,
  affecterRetablissement
}