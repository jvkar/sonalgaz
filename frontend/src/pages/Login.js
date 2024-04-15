import React from 'react'
import  '../styles/login.css'
import Paper from '@mui/material/Paper';
import { Box } from '@mui/material'
import LoginForm from '../components/forms/loginForm'

const Login = () => {
    return (
        <div className='containerr' style={{ display:"flex",justifyContent:"center",alignItems:"center"}}>
 <Box
                    sx={{
                        display: 'flex',
                        justifyContent:"center",
                        flexWrap: 'wrap',
                        '& > :not(style)': {
                        m: 1,
                        height: "75vh",
                        borderRadius:"20px",
                        },
                    }}
                    >
                    <Paper elevation={3} >
                        <LoginForm/>
                    </Paper>
                    </Box>
        </div>
    )
}

export default Login