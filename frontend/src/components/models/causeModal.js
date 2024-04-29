import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { BorderRight } from '@mui/icons-material';
import { TbBorderRadius } from 'react-icons/tb';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  borderRadius: '25px',
  boxShadow: 24,
  p: 4,
};

export default function CauseModal({ clientId, updateUrl }) {
  const [open, setOpen] = React.useState(false);
  const [client, setClient] = React.useState(null);
  const [error, setError] = React.useState(null);

  const handleOpen = async () => {
    setOpen(true);
    updateUrl(clientId);
    try {
      const response = await fetch(`/api/Clients/cause/${clientId}`, {
        method: 'GET'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const json = await response.json();
      setClient(json);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    }
  };

  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}>plus de details</Button>
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
            La cause d'invalidation pour {client?.nomClient}
          </Typography>
          <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
            {error ? (
              <p>Error: {error}</p>
            ) : (
              client && <p>{client.cause}</p>
            )}
          </Typography>
          <Button onClick={handleClose} style={{    transform: "translate(250%, 50%)"}} variant='outlined'>ferme</Button>
        </Box>
      </Modal>
    </div>
  );
}
