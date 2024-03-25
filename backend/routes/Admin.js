const express=require('express');
const router=express.Router();
const { 
    createAccount,loginUser
}= require ('../controllers/adminController')

router.post('/login',loginUser)

router.post('/createuser',createAccount)
module.exports=router