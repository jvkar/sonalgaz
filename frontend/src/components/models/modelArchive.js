import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Archiver from "../buttons/archiveButton";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useAuthContext } from "../../hooks/useAuthContext";
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
const ModelArchive = ({etablissementId}) => {
    const { user } = useAuthContext()
    const [error,setError] = useState(undefined)
    const [open ,setOpen] = useState(false)
    const [isLoading,setIsLoading] = useState(false)
    const archiveList = async (event) => {
        setIsLoading(true)
        event.preventDefault();
        try {
          const response = await fetch(
            `/api/Clients/archiver/${etablissementId}`,
            {
              method: "PATCH",
              headers: { Authorization: `Bearer ${user.token}` },
            }
          );
          const json = await response.json();
          if(response.ok){
              setIsLoading(false)
              setOpen(false)

          }
          if (!response.ok) {
            setError(json.error);
            setIsLoading(false)
            setTimeout(() => {
              setError("");
            }, 5000);
          }
        } catch (error) {
          setIsLoading(false)
          setError(error);
          setTimeout(() => {
            setError("");
          }, 5000);
        }
      };
 const handleOpen = () =>{ setOpen(true)}
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>

      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
        <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
            Confirmation D'archivage
          </Typography>
          <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
            {error ? (
             <div className="error">{error}</div>
            ) : (
                  <p>Etes-vous sur d'archiver la liste des coupures et retablissements</p>
            )}
          </Typography>
          <Button onClick={archiveList} variant='outlined' disabled={isLoading}>
            {isLoading? "Archiver..." : "Confirmer"}
          </Button>
          <Button onClick={handleClose}  variant='outlined'>Non</Button>
        </Box>
      </Modal>
      <Archiver openModal={handleOpen} />

    </div>
  );
};

export default ModelArchive;
