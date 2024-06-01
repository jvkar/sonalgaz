const { default: mongoose } = require('mongoose');
const Etablissement =require('../models/etablissementModel')
const Technicien = require('../models/technicienModel')
const Client = require ('../models/clientModel')
const jwt = require('jsonwebtoken')
const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}
function parseParamsFromURL(url) {
  const params = new URLSearchParams(url);
  const entrepriseId = params.get("entrepriseId");
  const TechnicianId = params.get("TechnicianId");
  return { entrepriseId, TechnicianId };
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
const affecterCoupureTechnicien = async (req, res) => {
  const { entrepriseId, technicianId } = req.params;

  try {
    const technicien = await Technicien.findOne({ _id: technicianId });
    if (!technicien) {
      return res.status(404).json({ error: "Technician not found" });
    }

    const nbrInterventionsTechnicien = technicien.nbrInterventions;
    const clients = await Client.find({
      entrepriseId: entrepriseId,
      archived: "Non Archiver",
      typeClient: "coupure",
      technicienId: null
    }).limit(nbrInterventionsTechnicien);

    if (clients.length === 0) {
      return res.status(500).json({ error: "No clients with these criteria" });
    }

    for (const client of clients) {
      await Client.findByIdAndUpdate(client._id, { technicienId: technicianId });
    }

    // Add a notification to the technician's notifications array
    const notificationMessage = `Vous avez été assigné à ${nbrInterventionsTechnicien} nouvelles coupures`;
    technicien.notfications.push({ message: notificationMessage, date: new Date().toISOString() });

    await technicien.save();

    return res.status(200).json(clients);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};




const affecterRetabTechnicien = async (req, res) => {
  const { entrepriseId, technicianId } = req.params;

  try {
    const technicien = await Technicien.findOne({ _id: technicianId });
    if (!technicien) {
      return res.status(404).json({ error: "Technician not found" });
    }

    const nbrInterventionsTechnicien = technicien.nbrInterventions;
    const clients = await Client.find({
      entrepriseId: entrepriseId,
      archived: "Non Archiver",
      typeClient: "retablissement",
      technicienId: null
    }).limit(nbrInterventionsTechnicien);

    if (clients.length === 0) {
      return res.status(500).json({ error: "No clients with these criteria" });
    }

    for (const client of clients) {
      await Client.findByIdAndUpdate(client._id, { technicienId: technicianId });
    }

    const notificationMessage = `Vous avez été assigné à ${nbrInterventionsTechnicien} nouveaux retablissements`;
    technicien.notfications.push({ message: notificationMessage, date: new Date().toISOString() });

    await technicien.save();

    return res.status(200).json(clients);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getCoupurePerTechnicien = async (req, res) => {
  const { id } = req.params;
  try {
    const coupures = await Client.find({ technicienId: id, typeClient: "coupure", archived: "Non Archiver" }).sort({ codeClient: 1 });
    if (coupures.length !== 0) {
      return res.status(200).json(coupures);
    }
    else{
      return res.status(500).json({message:"there s no data"})
   }
  } catch (error) {
    return res.status(500).json({ error: "An error occurred while fetching coupures for the technician" });
  }
};

const getRetablissementPerTechnicien = async (req, res) => {
  const { id } = req.params;
  try {
    const retablissements = await Client.find({ technicienId: id, typeClient: "retablissement", archived: "Non Archiver" }).sort({ codeClient: 1 });
    if (retablissements.length !== 0) {
      return res.status(200).json(retablissements);
    }
    else{
      return res.status(500).json({message:"there s no data"})
   }
  } catch (error) {
    return res.status(500).json({ error: "An error occurred while fetching retablissements for the technician" });
  }
};

const updateTechnicien = async(req,res)=>{
  const {id}=req.params
  const {nomTechnicien,codeTechnicien,nbrInterventions}=req.body
  try {
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({error:"techncien n'existe pas"});
    }


    const existingTechnicienByNumber = await Technicien.findOne({ codeTechnicien:codeTechnicien });
    if (existingTechnicienByNumber && existingTechnicienByNumber._id != id) {
      return res.status(400).json({ error: "a Technician with this number already exists" });
    }

    if(!nomTechnicien=="" && !codeTechnicien=="" && !nbrInterventions==""){
    const technicien =await Technicien.findOneAndUpdate({_id:id},
      {nomTechnicien:nomTechnicien,codeTechnicien:codeTechnicien,nbrInterventions:nbrInterventions}
      )
    const updatedTechnicien= await technicien.save();
    if(!updatedTechnicien){
     res.status(400).json("technicien n'existe pas");
    }

      res.status(200).json(updatedTechnicien);

  }
  else{
    res.status(500).json({error:"tous les champs doit etre remplis"})
  }
  }catch(error){
    res.status(400).json({error:error.message})
  }
}
const changePassword  = async (req,res) =>{
  const { username, password,newPassword,confirmedPassword } = req.body;
  try { 
     const user = await Technicien.changePassword(username,password,newPassword,confirmedPassword)

         return res.status(200).json({message:"le mot de pass est change avec succes"})

  } catch (error) {
      return res.status(400).json({error:error.message})
  }
}
const deleteTechnicien = async(req,res)=>{
  const id= req.params
  try { 
        const client = await Client.findOne({technicienId:id})
        if(!client){
        const technicien  = await Technicien.find({_id:id})
        if(technicien){
          return res.status(200).json(technicien.notfications)
        }
        }
        else{
          return res.status(500).json({message:"you can't delete this technicien"})
        }
  }catch(error){
          return res.status(500).json({error:message.error})
  }
}

const getNotfications = async (req, res) => {
  const { id } = req.params;

  try {
    const technicien = await Technicien.findOne({_id:id});
    
    if (!technicien) {
      return res.status(404).send('technicien not found');
    }

    res.json(technicien.notfications);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteTechnicianNotification = async (req, res) => {
  const { technicianId, notificationId } = req.params;

  try {
    const technicien = await Technicien.findById(technicianId);
    if (!technicien) {
      return res.status(404).json({ error: "Technician not found" });
    }

    const notificationIndex = technicien.notfications.findIndex(
      (notification) => notification._id.toString() === notificationId
    );

    if (notificationIndex === -1) {
      return res.status(404).json({ error: "Notification not found" });
    }

    technicien.notfications.splice(notificationIndex, 1); // Remove the notification

    await technicien.save(); // Save the updated technician

    return res.status(200).json(technicien.notfications);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
const deleteAllTechnicianNotifications = async (req, res) => {
  const { technicianId } = req.params;

  try {
    const technicien = await Technicien.findById(technicianId);
    if (!technicien) {
      return res.status(404).json({ error: "Technician not found" });
    }

    // Clear the notifications array
    technicien.notfications = [];

    await technicien.save(); // Save the updated technician

    return res.status(200).json({ message: "All notifications deleted successfully" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};



  module.exports={
    createAccount
    ,getTechnicienById
    ,affecterCoupureTechnicien
    ,affecterRetabTechnicien
    ,getCoupurePerTechnicien
    ,getRetablissementPerTechnicien
    ,updateTechnicien
    ,changePassword
    ,deleteTechnicien
    ,getNotfications
    ,deleteTechnicianNotification
    ,deleteAllTechnicianNotifications
  }