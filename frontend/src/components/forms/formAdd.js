import { Box, Button, Grid, IconButton, Typography } from '@mui/material'
import React from 'react'
import { IoIosClose } from "react-icons/io";
import TextField from '@mui/material/TextField';
import { useState } from 'react'
import { useAgenceContext } from '../../hooks/useAgenceContext'
import { useAuthContext } from '../../hooks/useAuthContext'
export default function FormAdd({closeEvent }) {
    const { user }= useAuthContext()
    const { dispatch } = useAgenceContext()
    const [nom,setNom]=useState('');
    const [numeroAgence,setNumeroAgence]=useState('');
    const [adresseAgence,setAdresseAgence]=useState('');
    const [numeroEntreprisesParAgence,setNumeroEntreprisesParAgence]=useState('');
    const [error, setError] = useState(null)
    const handleSubmit2=async(e)=>{
        e.preventDefault()
        if (!user) {
          setError('You must be logged in')
          return
        }
    
        const response= await fetch('/api/Agences/',{
          
          method:'POST',
          body:JSON.stringify({nom,numeroAgence,adresseAgence,numeroEntreprisesParAgence}),
          headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          }
        })
        const json=await response.json()
        if(!response.ok){
          setError(json.error)
        }
        if(response.ok){
          setError(null)
          setNom('')
          setNumeroAgence('')
          setAdresseAgence('')
          setNumeroEntreprisesParAgence('')
          dispatch({type:'CREATE_AGENCE',payload:json})
        }
      }
    return (
        <div>
            <form onSubmit={handleSubmit2}>
            <Box sx={{m:2}}/>
            <Typography variant="h5" align="center" >
                Ajouter Une Agence
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
                    <TextField value={numeroAgence} onChange={(e)=>setNumeroAgence(e.target.value)} id="NumeroAgence" label="Numéro de l'Agence" variant="outlined"  siz="small" sx={{minWidth:"100%"}}/>
                </Grid>
                <Grid item xs={12}>
                    <TextField  value={nom} onChange={(e)=>setNom(e.target.value)} id="NomAgence" label="Nom de l'Agence" variant="outlined"  siz="small" sx={{minWidth:"100%"}}/>
                </Grid>
                <Grid item xs={12}>
                    <TextField value={adresseAgence} onChange={(e)=>setAdresseAgence(e.target.value)} id="AdresseAgence" label="Adresse de l'Agence" variant="outlined"  siz="small" sx={{minWidth:"100%"}}/>
                </Grid>
                <Grid item xs={6}>
                    <TextField value={numeroEntreprisesParAgence} onChange={(e)=>setNumeroEntreprisesParAgence(e.target.value)} id="NumeroEntreprise" label="Numéro de l'entreprise " variant="outlined"  siz="small" sx={{minWidth:"100%"}}/>
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
