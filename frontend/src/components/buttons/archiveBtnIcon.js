import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import ArchiveIcon from '@mui/icons-material/Archive';
import Alert from '@mui/material/Alert';

export default function ArchiverBtn({openModal}) {
  const [open, setOpen] = React.useState(false);



  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <Button onClick={openModal} ><ArchiveIcon style={{color:"black"}}/></Button>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} style={{backgroundColor:"#323232"}}>
        <Alert
            style={{backgroundColor:"#323232"}}
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
        Archiver avec succès !    
        </Alert>
      </Snackbar>
    </div>
  );
}