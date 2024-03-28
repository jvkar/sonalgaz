import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import UpdateAgence from '../UpdateAgence';
import UpdateBtnAgence from '../buttons/updateBtnAgence';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #fff ',
  borderRadius: '12px',
  boxShadow: 24,
  p: 4,
};

const ModelUpdateAgence = ({agenceId }) => {
  const [openFormUpdate, setOpenFormUpdate] = useState(false);

  const handleOpenFormUpdate = () => setOpenFormUpdate(true);

  const handleClose = () => {
    setOpenFormUpdate(false);
  };

  return (
    <div>
      <Modal
        open={openFormUpdate}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <UpdateAgence closeEvent={handleClose} agenceId={agenceId}/>
        </Box>
      </Modal>
      <UpdateBtnAgence openModal={handleOpenFormUpdate} agenceId={agenceId} />
    </div>
  );
};
export default ModelUpdateAgence;