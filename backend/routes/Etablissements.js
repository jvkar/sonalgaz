const express=require('express');
const router=express.Router();
const {getAllEtablissement,

    updateEtablissemenet,
    deleteEtablissement,
    createEtablissement,
    upload,
    deleteAllEtablissements,
    addManyEtablissements,
    agencePerEntreprise,
    addToBlackList,
    getBlackList,
    getFromBlackList,
    createAccount
}=require("../controllers/etablissementController");
const requireAuth = require('../middleware/requireAuth')
router.post('/createuser',createAccount)
router.use(requireAuth)
router.get('/etablissement/:id',agencePerEntreprise)
router.get('/',getAllEtablissement);
router.post('/',createEtablissement);
router.delete('/BlackListAdd/:id',addToBlackList)
router.delete('/BlackListDel/:id',getFromBlackList)
router.delete('/delAll',deleteAllEtablissements)
router.get('/getBL/:id',getBlackList)
router.post('/add',upload,addManyEtablissements)
router.delete('/del/:id',deleteEtablissement)
router.patch('/update/:id',updateEtablissemenet)

module.exports=router