import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import FormAddEntrepriseCSV from '../forms/formAddEntrepriseCSV';
import FormAddEntreprise from '../forms/formAddEntreprise';
import AddButtonEntreprise from '../buttons/addBtnEntreprise';

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

const ModelAddEntreprise = () => {
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
          <FormAddEntreprise closeEvent={handleClose} />
        </Box>
      </Modal>
      <Modal
        open={openFormAddCSV}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <FormAddEntrepriseCSV closeEvent={handleClose} />
        </Box>
      </Modal>
      <AddButtonEntreprise Openn={handleOpenFormAdd} Open2={handleOpenFormAddCSV} />
    </div>
  );
};

export default ModelAddEntreprise;
