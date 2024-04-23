import AjoutTechnicienForm from '../components/AjoutTechnicien';
import React from 'react'
import { Box } from '@mui/material'
import Paper from '@mui/material/Paper';
const AjoutTechnicien = () => {
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
                    <AjoutTechnicienForm />
                </Paper>
            </Box>
        </div>
      );
}
 
export default AjoutTechnicien;