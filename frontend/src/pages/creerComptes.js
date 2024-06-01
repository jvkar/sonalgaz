import CreerCompteForm from "../components/CreerCompteForm";
import React from 'react'
import { Box } from '@mui/material'
import Paper from '@mui/material/Paper';
const CreerCompte = () => {
    return (
        <div>
                 <Box
                sx={{
                    display: 'flex',
                    justifyContent: "center",
                    flexWrap: 'wrap',
                    '& > :not(style)': {
                        m: 1,
                        width: "auto",
                        borderRadius: "25px "
                    },
                }}
            >
                <Paper elevation={3} >
                    <CreerCompteForm />
                </Paper>
            </Box>

        </div>
      );
}
 
export default CreerCompte;