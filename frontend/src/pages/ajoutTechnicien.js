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
                        width: "60%",
                        borderRadius: "50px "
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