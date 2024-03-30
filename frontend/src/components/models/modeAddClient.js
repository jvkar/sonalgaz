import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import FormAddClientCSV from '../forms/formAddClient';

import AddButtonClient from '../buttons/addBtnClient';

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

const ModelAddClient = () => {

  const [openFormAddCSV, setOpenFormAddCSV] = useState(false);


  const handleOpenFormAddCSV = () => setOpenFormAddCSV(true);

  const handleClose = () => {

    setOpenFormAddCSV(false);
  };

  return (
    <div>

      <Modal
        open={openFormAddCSV}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <FormAddClientCSV closeEvent={handleClose} />
        </Box>
      </Modal>
      <AddButtonClient Open={handleOpenFormAddCSV}  />
    </div>
  );
};

export default ModelAddClient;
