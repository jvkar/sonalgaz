import CreerCompteForm from "../components/CreerCompteForm";
import React from 'react'
import { Box } from '@mui/material'
import Paper from '@mui/material/Paper';
import {Button} from "@mui/material";
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
                        width: "40%",
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