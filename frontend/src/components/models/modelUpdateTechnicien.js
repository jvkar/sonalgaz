import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import UpdateTechnicien from '../forms/UpdateTechnicien';
import UpdateBtnTechnicien from '../buttons/updateBtnEntreprise';

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

const ModelUpdateTechnicien = ({ technicienId, updateUrl }) => {
  const [openFormUpdate, setOpenFormUpdate] = useState(false);

  const handleOpenFormUpdate = () => {
    setOpenFormUpdate(true);

    updateUrl(technicienId);
  }

  const handleClose = () => {
    setOpenFormUpdate(false);
    updateUrl('')
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
          <UpdateTechnicien closeEvent={handleClose} technicienId={technicienId}/>
        </Box>
      </Modal>
      <UpdateBtnTechnicien openModal={handleOpenFormUpdate}/>
    </div>
  );
};
export default ModelUpdateTechnicien;