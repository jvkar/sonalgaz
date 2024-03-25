const express=require('express');
const router=express.Router();
const {createFacture,getAllFactures,getFacture,deleteFacture,updateFacture,getFactureByClient,addManyFactures,upload}=require('../controllers/factureController')


router.get('/ByClient/:NumClient',getFactureByClient)
//get all factures
router.get('/',getAllFactures)
//get a signle facture
router.get('/:id',getFacture)
//add a new facture
router.post('/',createFacture)
//add a list of factures
router.post('/add',upload,addManyFactures)
//delete a facture
router.delete('/:id',deleteFacture)
//update a facture
router.patch('/:id',updateFacture)
module.exports=router;