import React, { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useSearchParams } from 'react-router-dom';
import {  Grid,Divider,IconButton, Typography } from '@mui/material'
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { IoIosClose } from "react-icons/io";
const UpdateEtablissement = ({closeEvent}) => {
    const { user } = useAuthContext()
    const [Nom, setNom] = useState('')
    const [NumeroEtablissement, setNumeroEtablissement] = useState('')
    const [Adresse, setAdresse] = useState('')
    const [error, setError] = useState('')
    const [isLoading,setIsLoading] = useState(false)
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const handleSubmit = async (event) => {
        setIsLoading(true)
        event.preventDefault();

        if (!user) {
            setError('you must be logged in');
            return
        }
        const response = await fetch(`/api/Etablissements/update/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ Nom, NumeroEtablissement, Adresse }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })

        const json = await response.json()
        if (response.ok) {
            setIsLoading(false)
            setNom('')
            setNumeroEtablissement('')
            setAdresse('')
            setError(undefined)
            window.location.reload()
        }
        if (!response.ok) {
            setIsLoading(false)
            setError(json.error);

        }
    }
    return (

           <div>
           <Paper style={{boxShadow: "none"}}>
               <Typography variant="h4" align="center" style={{padding:"10px"}} >
               Mettre a jour l'enterprise
               </Typography>
               <IconButton
               style={{position:"absolute",top:"0",right:"0"}}
               onClick={closeEvent}
           >
               <IoIosClose />
           </IconButton>
               <Divider/>
               <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",textAlign:"center"}}>
                   <Grid style={{width:"100%"}} containerstyle={{paddingLeft:"15%",paddingTop:'2%'}}>
                       <Grid item xs={12} style={{paddingTop:"3%"}}>
                           <TextField id="outlined-basic" label="Nom de l'entreprise" width="15px" variant="outlined" value={Nom} onChange={(e) => setNom(e.target.value)} style={{minWidth:"100%"}}/>
                       </Grid>
                       <Grid item xs={12} style={{paddingTop:"2%"}}>
                           <TextField  label="Numero de l'entreprise" variant="outlined" value={NumeroEtablissement} onChange={(e) => setNumeroEtablissement(e.target.value)} style={{minWidth:"100%"}} />
                       </Grid>
                       <Grid item xs={12} style={{paddingTop:"2%"}}>
                           <TextField  label="adresse d'entreprise" variant="outlined" value={Adresse} onChange={(e) => setAdresse(e.target.value)}style={{minWidth:"100%"}} />
                       </Grid>
                       <Grid item xs={12} style={{paddingTop:"5%",paddingBottom:'5%'}}>
                           <Button type="submit" variant="contained">{isLoading? "entrain de mettre a jour ..." :"Mettre a jour"}</Button>
                       </Grid>
                   </Grid>
                   {error && <div className="error">{error}</div>}
               </form>    
           </Paper>
       </div>
   
    );
}

export default UpdateEtablissement;