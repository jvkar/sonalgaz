const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const EtablissementSchema = new Schema(
  {
    Nom: {
      type: String,
      required: true,
    },
    NumeroEtablissement: {
      type: Number,
      required: true,

    },
    Adresse: {
      type: String,
      required: true,
    },
    NombreDesCoupures: {
      type: Number,
      default: 0,
    },

    agence: { type: Schema.Types.ObjectId, ref: "Agence", default: null },
    affectationCoupure: {
      type: Number,
      default: 0,
    },
    etat:{
      type:String,
      default:"Non Archiver"
    },
    affectationRetablissement: {
      type: Number,
      default: 0,
    },
    timesInBlackList: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Etablissement", EtablissementSchema);
