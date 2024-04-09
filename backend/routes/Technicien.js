const express=require('express');
const router=express.Router();
const {
    createAccount
    ,getTechnicienById
    ,affecterCoupureTechnicien
    ,affecterRetabTechnicien
    ,getCoupurePerTechnicien
    ,getRetablissementPerTechnicien
    ,updateTechnicien
    ,changePassword
}= require('../controllers/technicienController')
const requireAuth = require('../middleware/requireAuth')
router.use(requireAuth)
router.post('/createuser/:id',createAccount)
router.get('/getTechniciens/:id',getTechnicienById)
router.patch ('/affecterCoupure/:entrepriseId/:technicianId',affecterCoupureTechnicien)
router.patch ('/affecterRetablissment/:entrepriseId/:technicianId',affecterRetabTechnicien)
router.get ('/coupurePerEtab/:id',getCoupurePerTechnicien)
router.get ('/retabPerEtab/:id',getRetablissementPerTechnicien)
router.patch ('/updateTechnicien/:id',updateTechnicien)
router.patch('/passwordChanged',changePassword)
module.exports=router