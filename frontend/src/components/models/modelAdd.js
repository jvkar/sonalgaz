import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import FormAddCSV from '../forms/formAddCsv';
import FormAdd from '../forms/formAdd';
import AddButtonAgance from '../addBtnAgence';

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

const ModelAdd = () => {
  const [openFormAdd, setOpenFormAdd] = useState(false);
  const [openFormAddCSV, setOpenFormAddCSV] = useState(false);

  const handleOpenFormAdd = () => setOpenFormAdd(true);
  const handleOpenFormAddCSV = () => setOpenFormAddCSV(true);

  const handleClose = () => {
    setOpenFormAdd(false);
    setOpenFormAddCSV(false);
  };

  return (
    <div>
      <Modal
        open={openFormAdd}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <FormAdd closeEvent={handleClose} />
        </Box>
      </Modal>
      <Modal
        open={openFormAddCSV}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <FormAddCSV closeEvent={handleClose} />
        </Box>
      </Modal>
      <AddButtonAgance Openn={handleOpenFormAdd} Open2={handleOpenFormAddCSV} />
    </div>
  );
};

export default ModelAdd;
