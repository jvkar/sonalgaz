import { useAuthContext } from "../hooks/useAuthContext";
import { useCreateAccount } from "../hooks/useCreateAccount";
import { useState } from "react";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Divider, FormControl, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, RadioGroup, TextField, Typography } from '@mui/material'
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import { MdAddToPhotos } from "react-icons/md";
import Alert from '@mui/material/Alert';
const AjoutTechnicienForm = () => {
    const { user } = useAuthContext()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [nomTechnicien, setNomTechnicien] = useState('')
    const [codeTechnicien, setCodeTechnicien] = useState('')
    const { technicienCreateAccount, etabCreateAccount, agenceCreateAccount, error, isLoading } = useCreateAccount()
    const [error2, setError] = useState(undefined);
    const [showPassword, setShowPassword] = useState(false);
    const [open, setOpen] = React.useState(false);
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
    };

  
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleSubmit = async (event) => {
        event.preventDefault()
        const headers = { 'Authorization': `Bearer ${user.token}` };
       await technicienCreateAccount(nomTechnicien,codeTechnicien, username, password, headers)

    }
    return (
        <div>
            <Box sx={{ m: 2 }} />
            <Typography variant="h4" align="center" >
                Créer des comptes Techniciens
            </Typography>
            <Divider />
            <form onSubmit={handleSubmit}>
                <Grid container >
                    <Grid item xs={6} sx={{ padding: "45px" }}>
                        <TextField
                            id="codeTechnicien"
                            type="number"
                            value={codeTechnicien}
                            onChange={(e) => setCodeTechnicien(e.target.value)}
                            label="code Technicien"
                            variant="outlined"
                            siz="small"
                            sx={{ minWidth: "100%", paddingBottom: "30px" }}
                        />
                        <TextField
                            id="nomTechnicien"
                            type="text"
                            value={nomTechnicien}
                            onChange={(e) => setNomTechnicien(e.target.value)}
                            label="Nom Technicien"
                            variant="outlined"
                            siz="small"
                            sx={{ minWidth: "100%", paddingBottom: "30px" }}
                        />
                        <TextField
                            id="Username"
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            variant="outlined"
                            siz="small"
                            sx={{ minWidth: "100%", paddingBottom: "30px" }}
                        />
                        <FormControl siz="small" variant="outlined" sx={{ minWidth: "100%", paddingBottom: "30px" }}>
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                                value={password} onChange={(e) => setPassword(e.target.value)}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={6} sx={{ paddingLeft: "50px" }} >
                        <img style={{ display: "block", paddingLeft: "80px", paddingTop: "15px" }} src={require('../images/myImage.png')} alt="sonelgaz logo" width="25%" height="50%" />
                        <FormControl >
                            <Stack direction="row" spacing={2} sx={{ paddingTop: "", paddingLeft: "50px" }}>
                                <Button type="submit" disabled={isLoading} variant="contained"> Créer </Button>
                            </Stack>
                        </FormControl>

                    </Grid>
                </Grid>

                {error && <div className="error">{error}</div>}
            </form>
        </div>
    );
}

export default AjoutTechnicienForm;