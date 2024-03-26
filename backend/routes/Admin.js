const express=require('express');
const router=express.Router();
const { 
    createAccount,loginUser
}= require ('../controllers/adminController')

router.post('/login',loginUser)
const requireAuth = require('../middleware/requireAuth')
router.use(requireAuth)
router.post('/createuser',createAccount)
module.exports=router