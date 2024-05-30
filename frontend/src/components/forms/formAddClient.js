import { Box, Button, Grid, IconButton, Typography } from '@mui/material'
import React from 'react'
import { IoIosClose } from "react-icons/io";
import TextField from '@mui/material/TextField';
import { useState } from 'react'
import { useClientContext } from '../../hooks/useClientContext'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useParams } from 'react-router-dom';
export default function FormAddClientCSV ({closeEvent }) {
    const { user }= useAuthContext()

    const [file, setFile] = useState(undefined)
    const [error, setError] = useState(null)
    const [clients ,setClients] = useState([])
    const [importing,setImporting] = useState(false)
    const {id} = useParams()
    const handleSubmit = async (e) => {
      setImporting(true)
        e.preventDefault()
        if (!user) {
          setError('You must be logged in')
          return
        }
    
        const client = {file}
        if(file === null || file === undefined ){
          console.log("Veuillez choisir un fichier");
        }else{
          const formData = new FormData();
          formData.append("file", file);
        const response = await fetch(`/api/Clients/addClients/${id}`, {
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
          setFile(undefined)
          setClients(json)
          setImporting(false)
       
         
          
        }
      }
    
      }
    return (
        
        <div>
            <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <Box sx={{m:2}}/>
            <Typography variant="h5" align="center" >
                Ajouter Une liste clients CSV
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
                    <Typography variant="h5" style={{marginTop:"11px", marginLeft:"30px"}}>
                        <Button type='submit' variant="contained" size="medium">
                          {importing ? "Importing..." : "Ajouter"}
                          </Button>
                    </Typography>
                </Grid>
            </Grid>
            <Box sx={{m:4}}/>
            </form>
        </div>
    )
}
