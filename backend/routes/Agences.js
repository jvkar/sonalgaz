const express=require('express');
const router=express.Router();
const {getAllAgences
    ,createAgence
    ,upload
    ,addManyAgences
    ,entrepriseParAgence
    ,createAccount
    ,deleteAgence
    ,deleteAllAgences
    ,updateAgence
    ,entrepriseParCadre
}=require("../controllers/agenceController");
const requireAuth = require('../middleware/requireAuth')
router.post('/createuser',createAccount)
router.use(requireAuth)
router.get('/',getAllAgences);
router.get('/etab/:id',entrepriseParCadre);
router.delete('/deleteOne/:id',deleteAgence)
router.delete('/deleteAll',deleteAllAgences)
router.post('/',createAgence);
router.post('/add',upload,addManyAgences);
router.get('/agence/:id',entrepriseParAgence);
router.patch('/update/:id',updateAgence)
module.exports=router