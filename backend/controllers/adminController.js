const { default: mongoose } = require('mongoose');
const jwt = require('jsonwebtoken')
const { json } = require('express');
const Admin= require('../models/adminModel')
const Technicien = require('../models/technicienModel')
const CadreAgence= require('../models/cadreAgenceModel')
const Agence =require('../models/agenceModel')
const Etablissement =require('../models/etablissementModel')
const ResponsableEntreprise= require('../models/responsableEntreprise')
const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
  }
  
  const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        let user;
        let userType;


        user = await CadreAgence.login(username, password);
        if (user) {
            userType = 'CadreAgence';

        } else {

            user = await Admin.login(username, password);
            if (user) {
                userType = 'admin';
            } else {
                user = await ResponsableEntreprise.login(username, password);
                if (user) {
                    userType = 'responsableEntreprise';
                } else {
                    user= await Technicien.login(username,password);
                    if(user){   
                    userType ='technicien'
                    }
                    
                    
                }
            }
        }

        if (user) {
            let token = createToken(user._id);

            if (userType === 'CadreAgence') {
                const Cadre = await CadreAgence.findOne({ username: username });
                const agence = await Agence.findOne({ _id: Cadre.agence });
                const nomAgence = agence.nom;
                res.status(200).json({ username, userType, token, agence: Cadre.agence, nom: nomAgence });
            }else if ( userType==='responsableEntreprise') {
                const responsableEntreprise = await ResponsableEntreprise.findOne({username:username});
                const entreprise = await Etablissement.findOne({_id:responsableEntreprise.etablissement});
                const nomEntreprise = entreprise?.Nom;
                res.status(200).json({username,userType,token,entreprise:responsableEntreprise.etablissement,nom:nomEntreprise})
            }else if(userType ==='technicien'){
                const technicien = await Technicien.findOne({username:username});
                // const technicien = await Technicien.findOne({_id:technicien.entrepriseId});
                const nomTechnicien = technicien?.nomTechnicien;
                res.status(200).json({username,userType,token,technicien:technicien._id,nom:nomTechnicien})

            }
            else {
                res.status(200).json({ username, userType, token });
            }
        } else {
            res.status(401).json({ error: "Invalid username or password" });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

  const createAccount=async(req,res)=>{


    try {
  
      const {grade,username, password} = req.body

      const admin = await Admin.createAccount(grade,username, password)
      const token = createToken(admin._id)
      res.status(200).json({username, token})

    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  const changePassword  = async (req,res) =>{
    const { username, password,newPassword,confirmedPassword } = req.body;
    try { 
       const user = await Admin.changePassword(username,password,newPassword,confirmedPassword)

           return res.status(200).json({message:"le mot de pass est change avec succes"})
 
    } catch (error) {
        return res.status(400).json({error:error.message})
    }
  }
  module.exports={
    createAccount,loginUser,changePassword
  }