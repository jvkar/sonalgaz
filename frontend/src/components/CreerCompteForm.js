import React, { useState } from "react";
import { useCreateAccount } from "../hooks/useCreateAccount";
import { useAuthContext } from "../hooks/useAuthContext";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Divider, FormControl, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, RadioGroup, TextField, Typography } from '@mui/material'
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
const CreerCompteForm = () => {
    const { user } = useAuthContext()
    const [agence, setAgence] = useState('');
    const [entreprise, setEntreprise] = useState('');
    const [nomCadre,setNomCadre] = useState ('')
    const [nomResponsable,setNomResponsable] = useState('')
    const [numeroAgence, setNumeroAgence] = useState('');
    const [NumeroEtablissement, setNumeroEtablissement] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error2, setError] = useState(undefined);
    const { etabCreateAccount, agenceCreateAccount, error, isLoading } = useCreateAccount()
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleClear = (e) => {
        e.preventDefault()
        setNumeroAgence('')
        setNumeroEtablissement('')
        setAgence(false)
        setEntreprise(false)
        setUsername('')
        setPassword('')
        setNomCadre('')
        setNomResponsable('')
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('You must be logged in')
            return
        }

        let userType = '';
        let numeroKey = '';
        if (agence != '') {
            userType = 'agence';
            numeroKey = "numeroAgence"
        }
        else if (entreprise != '') {
            userType = 'entreprise';
            numeroKey = "NumeroEtablissement"
        }
        const headers = { 'Authorization': `Bearer ${user.token}` };
        userType === 'agence' ? await agenceCreateAccount(nomCadre,numeroAgence, username, password, headers) : await etabCreateAccount(nomResponsable,NumeroEtablissement, username, password, headers)
        handleClear(e);
    };
    return (
        <div>
            <Box sx={{ m: 2 }} />
            <Typography variant="h4" align="center" >
                Créer des comptes
            </Typography>
            <Divider />
            <form onSubmit={handleSubmit}>
                <Grid container >
                    <Grid item xs={6} sx={{ padding: "45px" }}>
                        <TextField
                            id="Numero"
                            type="number"
                            value={agence ? numeroAgence : NumeroEtablissement}
                            onChange={(e) => {
                                setNumeroAgence(agence ? e.target.value : numeroAgence);
                                setNumeroEtablissement(entreprise ? e.target.value : NumeroEtablissement);
                            }}
                            label="Numéro (Agence/Entreprise)"
                            variant="outlined"
                            siz="small"
                            sx={{ minWidth: "100%", paddingBottom: "30px" }}
                        />
                        <TextField
                            id="nom"
                            label="Nom (Cadre/Responsable)"
                            value={agence ? nomCadre: nomResponsable}
                            onChange={(e) => {
                                setNomCadre(agence ? e.target.value : nomCadre);
                                setNomResponsable(entreprise ? e.target.value : nomResponsable);
                            }}
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
                            <RadioGroup
                                style={{ paddingTop: "20 px", paddingBottom: "15px", paddingLeft: "25px" }}
                                row
                            >
                                <FormControlLabel value="agence" checked={agence} onChange={(e) => { setAgence(true); setEntreprise(false) }} control={<Radio />} label="Agence" />
                                <FormControlLabel value="entreprise" checked={entreprise} onChange={(e) => { setAgence(false); setEntreprise(true) }} sx={{ paddingLeft: "25px" }} control={<Radio />} label="Entreprise" />
                            </RadioGroup>
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

export default CreerCompteForm;

