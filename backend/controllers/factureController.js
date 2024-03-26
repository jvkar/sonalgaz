const { default: mongoose } = require('mongoose');
const Facture=require('../models/factureModel')
const Client=require('../models/clientModel');
const csvtojson =require ('csvtojson');
const multer = require('multer');
const path = require('path');
// const mime = require('mime-types');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, path.join(__dirname, '..', '/filesFactures'));
  },
  filename: function(req, file, cb) {
      cb(null,file.originalname);
  }
});


const upload = multer({storage}).single('file');
const addManyFactures = async (req,res)=>{
  const NumeroClient=Facture.NumeroClient
  const existingClient = await Client.find({ NumClient: NumeroClient  });

  if (!existingClient) {
    return res.status(404).json({ error: "il faut creer les clients correspendant au numero de la facture"});
  }
  const csvfilepath = __dirname +'/../filesFactures/'+req.file?.originalname;

   csvtojson()
   .fromFile(csvfilepath)
   .then((csvData)=>{
    console.log(csvData)
    Facture.insertMany(csvData)
    .then(function(){
      console.log("Data inserted")
      res.json({success:"success"})
    })
    .catch(function(error){
      console.log(error)
    })
   })
}


const getFactureByClient=async(req,res)=>{
  try {
    const {NumClient}=req.params;
    const facture =await Facture.find({
      NumeroClient:NumClient,
      
    })
    res.status(200).json(facture)
  }
  catch(error){
    console.error(error);
    res.status(500).json({error : 'Internal Server Error'});
  }
}
//get all factures
const getAllFactures = async (req, res) => {
  try {
      const factures = await Facture.find({});

      if (Array.isArray(factures)) {
       res.json(factures);
       

          
      } else {
          res.status(500).json({ error: 'Unexpected data format' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};
//get a signle facture
const getFacture=async(req,res)=>{
    const {id}=req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({error:'facture doesnnot exist'});
    }
    const facture=await Facture.findById(id)
    if(!facture){
         return res.status(404).json({error:'facture doesnnot exist'});
    }
     res.status(200).json(facture);
}


//add a new facture
const createFacture= async (req, res) => {
    const {Numero,NumeroClient} = req.body
  

    try {
      const existingClient = await Client.findOne({ NumClient: NumeroClient  });

      if (!existingClient) {
        return res.status(404).json({ error: "ya pas de client avec le numero "+NumeroClient });
      }
      else{
      const facture = await Facture.create({Numero,NumeroClient})
      res.status(200).json(facture)
      }
    } catch (error) {
      res.status(400).json({error: error.message})
    }
  }
//delete a facture
  const deleteFacture =async(req,res)=>{
    const {id}=req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({error:'facture doesnnot exist'});
    }
    const facture= await Facture.findOneAndDelete({_id:id});
    if(!facture){
      return res.status(404).json({error:'facture doesnnot exist'});
    }
    res.status(200).json(facture);
    
  }

//update a facture
   const updateFacture=async(req,res)=>{
    const {id}=req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({error:'facture doesnnot exist'});
    }
    const facture =await Facture.findByIdAndUpdate({_id:id},
      {...req.body})
      if(!facture){
        return res.status(404).json({error:'facture doesnnot exist'});
      }
      res.status(200).json(facture);
      
    
   }
module.exports={
    createFacture,
    getAllFactures,
    getFacture,
    deleteFacture,
    updateFacture,
    getFactureByClient,
    addManyFactures,
    upload
}