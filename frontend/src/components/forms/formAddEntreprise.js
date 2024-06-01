import { Box, Button, Grid, IconButton, Typography, TextField, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { IoIosClose } from "react-icons/io";
import { useEtablissementContext } from '../../hooks/useEtablissementContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useAgenceContext } from '../../hooks/useAgenceContext';

const FormAddEntreprise = ({ closeEvent }) => {
  const { dispatch } = useEtablissementContext();
  const { user } = useAuthContext();
  const { agences, dispatch: AgenceDispatch } = useAgenceContext();

  const [Nom, setNom] = useState('');
  const [NumeroEtablissement, setNumeroEtablissement] = useState('');
  const [Adresse, setAdresse] = useState('');
  const [NombreDesCoupures, setNombreDesCoupures] = useState('');
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);
  const [numeroAgence, setNumeroAgence] = useState('');

  useEffect(() => {
    const fetchAgences = async () => {
      try {
        const response = await fetch("/api/Agences", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const json = await response.json();

        if (response.ok) {
          AgenceDispatch({ type: "SET_AGENCE", payload: json });
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (user) {
      fetchAgences();
    }
  }, [AgenceDispatch, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAdding(true);

    if (!user) {
      setError('You must be logged in');
      setAdding(false);
      return;
    }

    const newEtablissement = { Nom, NumeroEtablissement, Adresse, NombreDesCoupures, numeroAgence };

    try {
      const response = await fetch('/api/Etablissements/', {
        method: 'POST',
        body: JSON.stringify(newEtablissement),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
      } else {
        dispatch({ type: 'CREATE_ETABLISSEMENT', payload: json });
        setNom('');
        setNumeroEtablissement('');
        setAdresse('');
        setNombreDesCoupures('');
        setNumeroAgence('');
        setError(null);
      }
    } catch (err) {
      setError('An error occurred');
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box sx={{ m: 2 }} />
        <Typography variant="h5" align="center">
          Ajouter Une Entreprise
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
            <TextField
              value={NumeroEtablissement}
              onChange={(e) => setNumeroEtablissement(e.target.value)}
              id="NumeroEtablissement"
              label="Numero de l'entreprise"
              variant="outlined"
              size="small"
              sx={{ minWidth: "100%" }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={Nom}
              onChange={(e) => setNom(e.target.value)}
              id="NomEntreprise"
              label="Nom de l'entreprise"
              variant="outlined"
              size="small"
              sx={{ minWidth: "100%" }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={Adresse}
              onChange={(e) => setAdresse(e.target.value)}
              id="AdresseEntreprise"
              label="Adresse de l'entreprise"
              variant="outlined"
              size="small"
              sx={{ minWidth: "100%" }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              value={NombreDesCoupures}
              onChange={(e) => setNombreDesCoupures(e.target.value)}
              id="NombreDesCoupures"
              label="Nombre des coupures par entreprise"
              variant="outlined"
              size="small"
              sx={{ minWidth: "100%" }}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="select-label">Agence</InputLabel>
              <Select
                labelId="select-label"
                id="select"
                value={numeroAgence}
                onChange={(e) => setNumeroAgence(e.target.value)}
                label="Numéro Agence"
                variant="outlined"
                size="small"
                sx={{ minWidth: "100%", paddingBottom: "10px", marginBottom: "20px" }}
              >
                {agences?.map((agence) => (
                  <MenuItem key={agence._id} value={agence.numeroAgence}>
                    {agence.nom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h5" style={{ marginTop: "11px", marginLeft: "30px" }}>
              <Button type='submit' variant="contained" size="medium" disabled={adding}>
                {adding ? "Entrain d'ajout ..." : "Ajouter"}
              </Button>
            </Typography>
          </Grid>
        </Grid>
        <Box sx={{ m: 4 }} />
        {error && <div className='error'>{error}</div>}
      </form>
    </div>
  );
}

export default FormAddEntreprise;
