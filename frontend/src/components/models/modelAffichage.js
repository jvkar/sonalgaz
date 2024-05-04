import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TableAffiche from "../cards/TableAffiche";
import Affiche from "../buttons/AfficheBtn";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  bgcolor: "background.paper",
  border: "2px solid #fff ",
  borderRadius: "12px",
  boxShadow: 24,
  p: 4,
};
const ModelAffiche = () => {
  const [openTable, setOpenTable] = useState(false);

  const handleOpenTable = () => setOpenTable(true);

  const handleClose = () => {
    setOpenTable(false);
  };

  return (
    <div>

      <Modal
        keepMounted
        open={openTable}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
        <TableAffiche/>
        </Box>
      </Modal>
      <Affiche openModal={handleOpenTable}/>
    </div>
  );
};

export default ModelAffiche;
