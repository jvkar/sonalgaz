import { Box, Button, Grid, IconButton, Typography } from '@mui/material'
import React from 'react'
import { IoIosClose } from "react-icons/io";
import TextField from '@mui/material/TextField';
import { useState,useEffect } from 'react'
import { useEtablissementContext } from '../../hooks/useEtablissementContext'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useAgenceContext } from '../../hooks/useAgenceContext';
import {

  FormControl,

  InputLabel,

} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

import Select from "@mui/material/Select";
import FormControlLabel from "@mui/material/FormControlLabel";
const FormAddEntreprise=({closeEvent})=>{
    const { dispatch } = useEtablissementContext()
    const { user } = useAuthContext()
    const [Nom, setNom] = useState('')
    const [NumeroEtablissement, setNumeroEtablissement] = useState('')
    const [Adresse, setAdresse] = useState('')
    const [NombreDesCoupures, setNombreDesCoupures] = useState('')
    const [error, setError] = useState(null)
    const [isLoading,setIsLoading] = useState(false)
    const [agence, setAgence] = useState(true);
    const [numeroAgence, setNumeroAgence] = useState("");

    const { agences, dispatch:AgenceDispatch } = useAgenceContext();
    useEffect(() => {
      const fetchAgences = async () => {
        setIsLoading(true)
        const response = await fetch("/api/Agences", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const json = await response.json();
  
        if (response.ok) {
          AgenceDispatch({ type: "SET_AGENCE", payload: json });
  
          setIsLoading(false);
        }
      };
  
        fetchAgences();

    }, [AgenceDispatch, user]);
const handleSubmit2 = async (e) => {
    e.preventDefault()
    if (!user) {
      setError('you must be logged in')
    }
    const response = await fetch('/api/Etablissements/', {

      method: 'POST',
      body: JSON.stringify({ Nom, NumeroEtablissement, Adresse, NombreDesCoupures,numeroAgence }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()
    if (!response.ok) {
      setError(json.error)
    }
    if (response.ok) {
      setError(null)
      setNom('')
      setNumeroEtablissement('')
      setAdresse('')
      setNombreDesCoupures('')
      dispatch({ type: 'CREATE_ETABLISSEMENT', payload: json })
    }
  }
  return(
    <div>
    <form onSubmit={handleSubmit2}>
    <Box sx={{m:2}}/>
    <Typography variant="h5" align="center" >
        Ajouter Une Entreprise
    </Typography>
    <IconButton
        style={{position:"absolute",top:"0",right:"0"}}
        onClick={closeEvent}
    >
        <IoIosClose />
    </IconButton>
    <Box height={20}/>
    <Grid container spacing={2}>
        <Grid item xs={12}>
            <TextField value={NumeroEtablissement} onChange={(e)=>setNumeroEtablissement(e.target.value)} id="NumeroAgence" label="Numero de l'entreprise" variant="outlined"  siz="small" sx={{minWidth:"100%"}}/>
        </Grid>
        <Grid item xs={12}>
            <TextField  value={Nom} onChange={(e)=>setNom(e.target.value)} id="NomEntreprise" label="Nom de l'entreprise" variant="outlined"  siz="small" sx={{minWidth:"100%"}}/>
        </Grid>
        <Grid item xs={12}>
            <TextField value={Adresse} onChange={(e)=>setAdresse(e.target.value)} id="AdresseAgence" label="Adresse de l'entreprise" variant="outlined"  siz="small" sx={{minWidth:"100%"}}/>
        </Grid>
        <Grid item xs={6}>
            <TextField value={NombreDesCoupures} onChange={(e)=>setNombreDesCoupures(e.target.value)} id="NumeroEntreprise" label="Nombre des coupures par entreprise " variant="outlined"  siz="small" sx={{minWidth:"100%"}}/>
        </Grid>
        <Grid item xs={6}>

        <FormControl fullWidth>
              <InputLabel id="select-label">
               Agence
              </InputLabel>
              <Select
                labelId="select-label"
                id="select"
                value={numeroAgence}
                onChange={(e) => {
                  if (agence) {
                    setNumeroAgence(e.target.value);
                  }
                }}
                label="Numéro Agence"
                variant="outlined"
                size="small"
                sx={{ minWidth: "100%", paddingBottom: "10px",marginBottom:"20px" }}
              >

                {agences?.map((agence) => (
                  <MenuItem key={agence._id} value={agence.numeroAgence}>
                    {agence.nom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            </Grid>

        <Grid item xs={6}>
            <Typography variant="h5" style={{marginTop:"11px", marginLeft:"30px"}}>
                <Button type='submit'variant="contained" size="medium">Ajouter</Button>
            </Typography>
        </Grid>
    </Grid>
    <Box sx={{m:4}}/>
    </form>
</div>
  )
}
export default FormAddEntreprise