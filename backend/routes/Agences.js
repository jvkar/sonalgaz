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
    ,etatAgence
    ,changePassword

}=require("../controllers/agenceController");
const requireAuth = require('../middleware/requireAuth')
router.use(requireAuth)
router.post('/createuser',createAccount)
router.get('/',getAllAgences);
router.get('/etab/:id',entrepriseParCadre);
router.delete('/deleteOne/:id',deleteAgence)
router.delete('/deleteAll',deleteAllAgences)
router.post('/',createAgence);
router.post('/add',upload,addManyAgences);
router.get('/agence/:id',entrepriseParAgence);
router.patch('/update/:id',updateAgence)
router.patch('/stateChange/:id',etatAgence)
router.patch('/passwordChanged',changePassword)

module.exports=router