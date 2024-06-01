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
    ,changePassword
    ,getNumberOfEtablissements
    ,getNumberOfEtablissementsPerAgence
    ,archiverEntreprise
    ,archiverToutLesEntreprises
    ,nombreEntreprisesArchiver
    ,nombreDesEntreprisesListeNoire
    ,getArchivedEntreprises
    ,getNotfications
    ,deleteAllEntrepriseNotifications
}=require("../controllers/etablissementController");
const requireAuth = require('../middleware/requireAuth')
router.use(requireAuth)
router.post('/createuser',createAccount)
router.get('/getBL/:id',getBlackList)
router.get('/etablissement/:id',agencePerEntreprise)
router.get('/',getAllEtablissement);
router.post('/',createEtablissement);
router.post('/BlackListAdd/:id',addToBlackList)
router.delete('/BlackListDel/:id',getFromBlackList)
router.delete('/delAll',deleteAllEtablissements)
router.post('/add',upload,addManyEtablissements)
router.delete('/del/:id',deleteEtablissement)
router.patch('/update/:id',updateEtablissemenet)
router.patch('/passwordChanged',changePassword)
router.get('/lengthEtablissements',getNumberOfEtablissements)
router.get('/lengthEtablissementsPerAgence/:id',getNumberOfEtablissementsPerAgence)
router.patch('/archiverEntreprise/:id',archiverEntreprise)
router.patch('/archiveAll',archiverToutLesEntreprises);
router.get('/ListeNoireNumber/:id',nombreDesEntreprisesListeNoire)
router.get('/nombreArchiver/:id',nombreEntreprisesArchiver)
router.get('/getArchived',getArchivedEntreprises)
router.get('/getNotification/:id',getNotfications)
router.delete('/:entrepriseId/notifications', deleteAllEntrepriseNotifications);

module.exports=router