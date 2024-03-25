import React from 'react'
import  '../styles/login.css'
import Paper from '@mui/material/Paper';
import { Box } from '@mui/material'
import LoginForm from '../components/forms/loginForm'

const Login = () => {
    return (
        <div className='containerr' style={{ display:"flex",justifyContent:"center",alignItems:"center"}}>

                    <Paper elevation={3} >
                        <LoginForm/>
                    </Paper>
            
        </div>
    )
}

export default Login