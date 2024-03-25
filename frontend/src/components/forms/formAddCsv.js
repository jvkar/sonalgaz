import { Box, Button, Grid, IconButton, Typography } from '@mui/material'
import React from 'react'
import { IoIosClose } from "react-icons/io";
import TextField from '@mui/material/TextField';
import { useState } from 'react'
import { useAgenceContext } from '../../hooks/useAgenceContext'
import { useAuthContext } from '../../hooks/useAuthContext'

export default function FormAddCSV ({closeEvent }) {
    const { user }= useAuthContext()
    const { dispatch } = useAgenceContext()
    const [numeroEntreprisesParAgence,setNumeroEntreprisesParAgence]=useState('');
    const [file, setFile] = useState(undefined)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!user) {
          setError('You must be logged in')
          return
        }
    
        const agence = {file}
        if(file === null || file === undefined ){
          console.log("Veuillez choisir un fichier");
        }else{
          const formData = new FormData();
          formData.append("file", file);
          formData.append("numeroEntreprisesParAgence",numeroEntreprisesParAgence);
    
        
        const response = await fetch('/api/Agences/add', {
          method: 'POST',
          body: formData,
    
          headers:{'Authorization': `Bearer ${user.token}`}
        
        })
        const json = await response.json()
    
        if (!response.ok) {
          setError(json.error)
        }
        if (response.ok) {
          setError(null)
          setNumeroEntreprisesParAgence('')
          setFile(undefined)
          dispatch({type: 'CREATE_AGENCE', payload: json})
    
         
          
        }
      }
      window.location.reload();
    
      }
    return (
        
        <div>
            <form onSubmit={handleSubmit}>
            <Box sx={{m:2}}/>
            <Typography variant="h5" align="center" >
                Ajouter Une Agence CSV
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
                    <input type="file" onChange={(e) => setFile(e.target.files[0])}/>
                </Grid>
                <Grid item xs={6}>
                    <TextField id="NumeroEntreprise" value={numeroEntreprisesParAgence}type="number "onChange={(e)=>setNumeroEntreprisesParAgence(e.target.value)} label="le nombres des entreprises par agence " variant="outlined"  siz="small" sx={{minWidth:"100%"}}/>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h5" style={{marginTop:"11px", marginLeft:"30px"}}>
                        <Button type='submit' variant="contained" size="medium">Ajouter</Button>
                    </Typography>
                </Grid>
            </Grid>
            <Box sx={{m:4}}/>
            </form>
        </div>
    )
}
