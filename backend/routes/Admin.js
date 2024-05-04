const express=require('express');
const router=express.Router();
const { 
    createAccount,loginUser,changePassword,afficherLesCadres,afficherLesResponsables
}= require ('../controllers/adminController')

router.post('/login',loginUser)
const requireAuth = require('../middleware/requireAuth')
router.use(requireAuth)
router.post('/createuser',createAccount)
router.patch('/passwordChanged',changePassword)
router.get('/Cadres',afficherLesCadres)
router.get('/Responsables',afficherLesResponsables)
module.exports=router