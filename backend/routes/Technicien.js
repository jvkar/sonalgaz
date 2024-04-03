const express=require('express');
const router=express.Router();
const {
    createAccount
    ,getTechnicienById
}= require('../controllers/technicienController')
const requireAuth = require('../middleware/requireAuth')
router.use(requireAuth)
router.post('/createuser/:id',createAccount)
router.get('/getTechniciens/:id',getTechnicienById)
module.exports=router