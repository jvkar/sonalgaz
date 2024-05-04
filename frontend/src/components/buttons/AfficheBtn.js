import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import ArchiveIcon from '@mui/icons-material/Archive';
import Alert from '@mui/material/Alert';
import PersonIcon from '@mui/icons-material/Person';

export default function Affiche({openModal}) {

  return (
    <div>
      <Button variant="outlined" onClick={openModal} startIcon={<PersonIcon />}>Voire Les comptes</Button>
          
    </div>
  );
}