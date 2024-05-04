import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import ArchiverBtn from "../buttons/archiveBtnIcon";
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
const ModelArchiveEntreprise = ({etablissementId}) => {
    const { user } = useAuthContext()
    const [error,setError] = useState(undefined)
    const [open ,setOpen] = useState(false)
    const [entreprise , setEntreprise] = useState(etablissementId)

    const [isLoading ,setIsLoading] = useState(false)
    const handleArchive = async () => {
      setIsLoading(true)
      if (!user) {
        setError("you must be logged in")
        return
      }
      const response = await fetch(`/api/Etablissements/archiverEntreprise/${etablissementId}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${user.token}` }
      })
      const json = response.json()
      if (!response.ok) {
        setError(json.error)
      }
      if (response.ok) {
        setIsLoading(false)
        setEntreprise(json)
      }
    }
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
            Avertissement
          </Typography>
          <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
            {error ? (
              <p>Error: {error}</p>
            ) : (
                  <p>Etes-vous sur d'archiver cette entreprise</p>
            )}
          </Typography>
          <Button onClick={handleArchive} variant='outlined' disabled={isLoading}>
            {isLoading ? "Archiver..." :"Confirmer" }
          </Button>
          <Button onClick={handleClose}  variant='outlined'>Non</Button>
        </Box>
      </Modal>
      <ArchiverBtn openModal={handleOpen} />

    </div>
  );
};

export default ModelArchiveEntreprise;
