const express=require('express');
const router=express.Router();
const {getAllClient,
    createClient,
    getClientByFacture,
    addManyClient,
    upload,
    deleteClient,
    deleteAllClient,
    coupureParEtablissement,
    retabParEtablissement,
    getCoupures,
    getRetablissements,
    affecterCoupure,
    affecterRetablissement,
    archiverClient,
    validerClient,
    invaliderClient

}=require("../controllers/clientController");
router.get('/ByFacture/:NumClient',getClientByFacture);
router.get('/',getAllClient);
router.delete('/delete/:id',deleteClient);
router.post('/',createClient);
router.post('/addClients/:id',upload,addManyClient)
router.delete('/deleteAll',deleteAllClient)
router.get ('/coupurePerEtab/:id',coupureParEtablissement);
router.get ('/retabPerEtab/:id',retabParEtablissement);
router.get('/coupures/:id',getCoupures);
router.get('/retablissements/:id',getRetablissements);
router.patch('/affecterCoupure/:id',affecterCoupure)
router.patch('/affecterRetab/:id',affecterRetablissement)
router.patch('/archiver/:id',archiverClient)
router.patch('/valider/:id',validerClient)
router.patch('/invalider/:id',invaliderClient)


module.exports=router