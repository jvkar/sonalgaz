const express=require ('express');
const app= express();
const mongoose= require('mongoose');
const cors=require('cors')
require('dotenv').config()
mongoose.connect(process.env.MONG_URI)
.then((result)=>{
     app.listen(process.env.PORT);
})
.catch((err)=>{
     console.error("err",err.message);
})
const factureRoutes=require('./routes/Factures');
const clientRoutes=require ('./routes/Clients');
const etablissementRoutes=require ('./routes/Etablissements');
const agenceRoutes=require ('./routes/Agences');
const adminRoutes = require ('./routes/Admin')
app.use(cors());
app.use(express.json());
app.use((req,res,next)=>{
  next();
})
app.use('/api/Factures',factureRoutes);
app.use('/api/Clients',clientRoutes);
app.use('/api/Etablissements',etablissementRoutes);
app.use('/api/Agences',agenceRoutes);
app.use('/api/Admin',adminRoutes);
app.use('/filesAgences', express.static('./filesAgences'))
app.use('/filesClients', express.static('./filesClients'))
app.use('/filesFactures', express.static('./filesFactures'))
app.use('/filesEtablissement', express.static('./filesEtablissement'))
