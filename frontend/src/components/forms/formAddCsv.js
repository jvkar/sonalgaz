import { Box, Button, Grid, IconButton, Typography, TextField } from "@mui/material";
import React, { useState } from "react";
import { IoIosClose } from "react-icons/io";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function FormAddCSV({ closeEvent }) {
  const { user } = useAuthContext();
  const [numeroEntreprisesParAgence, setNumeroEntreprisesParAgence] = useState("");
  const [file, setFile] = useState(undefined);
  const [error, setError] = useState(null);
  const [importing, setImporting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setImporting(true);

    if (!user) {
      setError("You must be logged in");
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
    formData.append("numeroEntreprisesParAgence", numeroEntreprisesParAgence);

    try {
      const response = await fetch("/api/Agences/add", {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
      } else {
        setError(null);
        setNumeroEntreprisesParAgence("");
        setFile(undefined);
      }
    } catch (err) {
      setError("An error occurred while importing the file");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box sx={{ m: 2 }} />
        <Typography variant="h5" align="center">
          Ajouter Une Agence CSV
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
            <TextField
              id="NumeroEntreprise"
              value={numeroEntreprisesParAgence}
              type="number"
              onChange={(e) => setNumeroEntreprisesParAgence(e.target.value)}
              label="le nombres des entreprises par agence"
              variant="outlined"
              size="small"
              sx={{ minWidth: "100%" }}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography
              variant="h5"
              style={{ marginTop: "11px", marginLeft: "30px" }}
            >
              <Button type="submit" variant="contained" size="medium">
                {importing ? "Importing..." : "Ajouter"}
              </Button>
            </Typography>
          </Grid>
        </Grid>
        <Box sx={{ m: 4 }} />
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}
