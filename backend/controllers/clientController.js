const { default: mongoose } = require('mongoose');
const Client=require('../models/clientModel');
const Etablissement=require('../models/etablissementModel')
const ListIntervention= require('../models/ListeInterventionModel')
const Facture=require('../models/factureModel')
const csvtojson =require ('csvtojson');
const multer = require('multer');
const path = require('path');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const { isNull } = require('util');
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
    const clientRefs = clients.map(client=>client.referenceClient)
    const clientCompts = clients.map(client=>client.numeroCompteur)
    const clientTypes = clients.map(client=>client.typeClient)
    const clientEtats = clients.map(client=>client.etat)
    
    const listIntervention = await ListIntervention.create({
      entrepriseId: id,
      agenceId:entrep.agence,
      clients: clientIds.map((clientId, index) => ({
        _id: clientId,
        nomClient: clientNames[index],
        codeClient: clientCodes[index],
        adresseClient: clientAddresses[index],
        referenceClient:clientRefs[index],
        numeroCompteur:clientCompts[index],
        typeClient:clientTypes[index],
        etat:clientEtats[index]
      })),
      type:'coupures',
      iteration: iterationCoupure,
    });
    for(const client of clients){
      await Client.findByIdAndUpdate(client._id,{listId:listIntervention._id,entrepriseId:listIntervention.entrepriseId})
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
    const clientRefs = clients.map(client=>client.referenceClient)
    const clientCompts = clients.map(client=>client.numeroCompteur)
    const clientTypes = clients.map(client=>client.typeClient)
    const clientEtats = clients.map(client=>client.etat)
    
    const listIntervention = await ListIntervention.create({
      entrepriseId: id,
      agenceId:entrep.agence,
      clients: clientIds.map((clientId, index) => ({
        _id: clientId,
        nomClient: clientNames[index],
        codeClient: clientCodes[index],
        adresseClient: clientAddresses[index],
        referenceClient:clientRefs[index],
        numeroCompteur:clientCompts[index],
        typeClient:clientTypes[index],
        etat:clientEtats[index]
      })),
      type:'retablissements',
      iteration: iterationRetablissement,
    });
    for(const client of clients){
      await Client.findByIdAndUpdate(client._id,{listId:listIntervention._id,entrepriseId:listIntervention.entrepriseId})
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
  const listClient=await ListIntervention.find({entrepriseId:id,type:'coupures',archive:"Non Archiver"})
  res.status(200).json(listClient)    
  }
  catch(error){
    res.status(400).json({error:error.message});
  }
}
const retabParEtablissement=async (req,res)=>{
  const {id}=req.params
  try {
  const listClient=await ListIntervention.find({entrepriseId:id,type:'retablissements',archive:"Non Archiver"})
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
  const archiverClient = async (req, res) => {
    const { id } = req.params;
    try {
      const listInterventions = await ListIntervention.find({ entrepriseId: id });
  
      for (const intervention of listInterventions) {
        const interventionId = intervention._id;
  
        await ListIntervention.updateMany(
          { _id: interventionId, archive: "Non Archiver" },
          { archive: "archiver" }
        );
  
        const clients = await Client.find({ listId: interventionId });
  
        await Client.updateMany(
          { listId: interventionId },
          { archived: "archiver" }
        );
      }
  
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };
  const validerClient = async (req, res) => {
    const { id } = req.params;
    try {
      const client = await Client.findOne({ _id: id, etat: "en attente" });
  
      if (!client) {
        return res.status(404).json({ message: "Client not found or not in 'en attente' state" });
      }
  
      const list = await ListIntervention.findOne({ clients: { $elemMatch: { _id: id } } });
  
      if (!list) {
        return res.status(404).json({ message: "List of interventions not found" });
      }
      const foundClientIndex = list.clients.findIndex((element) => element._id.toString() === id);

      if (foundClientIndex === -1) {
        return res.status(404).json({ message: "Client not found in the list of interventions" });
      }
  
      list.clients[foundClientIndex].etat = "valider";
      await list.save();


      await Client.findByIdAndUpdate(client._id, { etat: "valider" });
  
      return res.status(200).json({ message: "Client validated successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  
  const invaliderClient = async (req, res) => {
    const { id } = req.params;
    try {

      const client = await Client.findOne({ _id: id, etat: "en attente" });
  
      if (!client) {
        return res.status(404).json({ message: "Client not found or not in 'en attente' state" });
      }
  

      const list = await ListIntervention.findOne({ clients: { $elemMatch: { _id: id } } });
  
      if (!list) {
        return res.status(404).json({ message: "List of interventions not found" });
      }
      const foundClientIndex = list.clients.findIndex((element) => element._id.toString() === id);

      if (foundClientIndex === -1) {
        return res.status(404).json({ message: "Client not found in the list of interventions" });
      }
  
   
      list.clients[foundClientIndex].etat = "invalider";
      await list.save();
      

  
      await Client.findByIdAndUpdate(client._id, { etat: "invalider" });
  
      return res.status(200).json({ message: "Client invalidated successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  const getCoupureLenghtPerAgence = async (req,res) =>{
    const { id }  = req.params    
    try {
      const coupures = await Client.find({agence:id,typeClient:"coupure"})
      if(coupures){
       const  coupuresLength= coupures.length
        res.status(200).json(coupuresLength)
      }

    }catch(error){
      res.status(400).json({error:error.message})
    }
  }
  const getCoupureLenghtPerEntreprise = async (req,res) =>{
    const { id }  = req.params    
    try {
      const coupures = await Client.find({entrepriseId:id,typeClient:"coupure"})
      if(coupures){
       const  coupuresLength= coupures.length
        res.status(200).json(coupuresLength)
      }

    }catch(error){
      res.status(400).json({error:error.message})
    }
  }
  const getRetablissementsLenghtPerAgence = async (req,res) =>{
    const {id} = req.params
    try {
      const retablissements = await Client.find({agence:id,typeClient:"retablissement"})
      if(retablissements){
       const  retablissementsLength= retablissements.length
        
        res.status(200).json(retablissementsLength)
      }
    }catch(error){
      res.status(400).json({error:error.message})
    }
  }
  const getRetablissementsLenghtPerEntreprise = async (req,res) =>{
    const {id} = req.params
    try {
      const retablissements = await Client.find({entrepriseId:id,typeClient:"retablissement"})
      if(retablissements){
       const  retablissementsLength= retablissements.length
        
        res.status(200).json(retablissementsLength)
      }
    }catch(error){
      res.status(400).json({error:error.message})
    }
  }
  const getClientLengthPerAgence = async (req,res) =>{
    const {id} = req.params
    try{
      const clients = await Client.find({agence:id})
      if(clients){
        const clientsLength = clients.length 
        res.status(200).json(clientsLength)
      }
    }catch(error){
      res.status(400).json({error:error.message})
    }
  }
  const getClientLengthPerEntreprise = async (req,res) =>{
    const {id} = req.params
    try{
      const clients = await Client.find({entrepriseId:id})
      if(clients){
        const clientsLength = clients.length 
        res.status(200).json(clientsLength)
      }
    }catch(error){
      res.status(400).json({error:error.message})
    }
  }
  const exportPDFclients = async (req, res) => {
    try {
      const clients = await Client.find({typeClient:"coupure"});
      const doc = new PDFDocument();
      const filename = 'client_list.pdf';
      const filePath = `./pdfs/${filename}`;
  
      doc.pipe(fs.createWriteStream(filePath));
  
      // Add image
      doc.image('./public/myImage.png', { width: 450, align: 'center' }).moveDown(15); // Adjust vertical spacing if needed
  
      // Add horizontal line
      doc.moveTo(50, doc.y)
        .lineTo(550, doc.y)
        .stroke()
        .moveDown(0.5); // Adjust vertical spacing if needed
  
      // Add title
      doc.fontSize(14).text('La liste des coupures', { align: 'center' }).moveDown();
  
      // Add table headers
      doc.font('Helvetica-Bold');
      const headerY = doc.y;
      doc.text('Reference', 50, headerY);
      doc.text('Nom', 150, headerY);
      doc.text('Etat', 250, headerY);
      doc.text('Cause', 450, headerY);
      doc.moveDown();
  
      // Add table rows
      doc.font('Helvetica');
      clients.forEach((client) => {
        const dividerY = doc.y;
        doc.moveTo(50, dividerY)
          .lineTo(550, dividerY)
          .stroke()
          .moveDown(1);
        

          // Position the text elements horizontally
          const line = doc.y
          doc.text(client.referenceClient, 50, line );
          doc.text(client.nomClient, 150,line );
          doc.text(client.etat, 250, line );
          doc.text(client.cause, 400, line );
          doc.moveDown();
  
        // Add divider after each row

      });
  
      doc.end();
  
      res.status(200).send('PDF exported successfully');
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  };
  
  
 

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
  affecterRetablissement,
  archiverClient,
  validerClient,
  invaliderClient,
  getCoupureLenghtPerAgence,
  getRetablissementsLenghtPerAgence,
  getClientLengthPerAgence,
  getCoupureLenghtPerEntreprise,
  getRetablissementsLenghtPerEntreprise,
  getClientLengthPerEntreprise,
  exportPDFclients

}