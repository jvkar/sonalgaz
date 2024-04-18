import React from 'react'
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, FormControl, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material'
import { useState } from "react";
import { useLogin } from "../../hooks/useLogin";
import Button from '@mui/material/Button';
import sonelgaz from '../../images/myImage.png'
const LoginForm = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { loginAdmin, error, isLoading } = useLogin()
    const handleLogin = async (e) => {
        e.preventDefault();

        await loginAdmin(username, password)

    }
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    return (
        <form style={{display:"flex",justifyContent:"center",flexDirection:"column",alignItems:"center",textAlign:"center"}} onSubmit={handleLogin}>

            <div>
                <img style={{ display: "block", paddingLeft: "40%", paddingTop: '8%' }} src={sonelgaz} alt="sonelgaz logo" width="20%" height="30%" />
            </div>
            <Box height={20} />
            <Grid container style={{ paddingTop: "20px" }} >
            <Grid container spacing={2} sx={{ padding: "35px", paddingBottom: "95px" }}>
            <Grid item xs={12} style={{width: "70%"}}>
                <TextField
                    id="username"
                    label="Username"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </Grid>
            <Grid item xs={12} style={{width: "70%"}}>
                <FormControl variant="outlined" size="small" fullWidth>
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                    />
                </FormControl>
            </Grid>
        </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" type="submit" disabled={isLoading} style={{ backgroundColor: "#f3610c" }}>
                        Se Connecter
                    </Button>
                </Grid>
                {error && <div className="error">{error}</div>}
            </Grid>
        </form>
    );
}

export default LoginForm;