import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { MdAddToPhotos } from "react-icons/md";
import Alert from '@mui/material/Alert';

export default function SnackBar({blackList}) {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
    {blackList>=3 && window.location.reload()}
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <Button style={{color : (blackList==3 ? "red" : "blue")}} disabled={(blackList==3)} onClick={handleClick} startIcon={<MdAddToPhotos />}>Liste noire</Button>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} style={{backgroundColor:"#323232"}}>
        <Alert
            style={{backgroundColor:"#323232"}}
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
        Ajouté avec succès !    
        </Alert>
      </Snackbar>
    </div>
  );
}