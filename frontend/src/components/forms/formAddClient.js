import { Box, Button, Grid, IconButton, Typography } from '@mui/material';
import React, { useState } from 'react';
import { IoIosClose } from "react-icons/io";
import { useAuthContext } from '../../hooks/useAuthContext';
import { useParams } from 'react-router-dom';

export default function FormAddClientCSV({ closeEvent }) {
  const { user } = useAuthContext();
  const [file, setFile] = useState(undefined);
  const [error, setError] = useState(null);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState(undefined);
  const { id } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setImporting(true);

    if (!user) {
      setError('You must be logged in');
      setImporting(false);
      return;
    }

    if (!file) {
      setError("Veuillez choisir un fichier");
      setImporting(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`/api/Clients/addClients/${id}`, {
        method: 'POST',
        body: formData,
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
      } else {
        setError(null);
        setFile(undefined);
        setMessage("Liste Importer avec success");
        window.location.reload()
      }
    } catch (error) {
      setError("An error occurred while importing the file");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
      >
        <Box sx={{ m: 2 }} />
        <Typography variant="h5" align="center">
          Ajouter Une liste clients CSV
        </Typography>
        <IconButton
          style={{ position: "absolute", top: "0", right: "0" }}
          onClick={closeEvent}
        >
          <IoIosClose />
        </IconButton>
        <Box height={20} />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h5" style={{ marginTop: "11px", marginLeft: "30px" }}>
              <Button type='submit' variant="contained" size="medium" disabled={importing}>
                {importing ? "Importing..." : "Ajouter"}
              </Button>
            </Typography>
          </Grid>
        </Grid>
        <Box sx={{ m: 4 }} />
        {error && <div className='error'>{error}</div>}
        {message && <div className='message'>{message}</div>}
      </form>
    </div>
  );
}
