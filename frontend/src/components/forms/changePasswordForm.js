import React, { useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import {  Button, Grid, Typography, Divider } from '@mui/material';
import TextField from '@mui/material/TextField';

const ChangePassForm = ({ closeEvent }) => {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [error, setError] = useState(null); // Change undefined to null for consistency

  const { user } = useAuthContext();
  const username = user.username;
  const userType = user.userType

  const handleUpdate = async (e) => {
    e.preventDefault();
  
    try {
      let url;
      switch (userType) {
        case 'Admin':
          url = '/api/Admin/passwordChanged';
          break;
        case 'CadreAgence':
          url = '/api/Agences/passwordChanged';
          break;
        case 'responsableEntreprise':
          url = '/api/Etablissements/passwordChanged';
          break;
        case 'technicien':
          url = '/api/Techniciens/passwordChanged';
          break;
        default:
          throw new Error('Invalid user type');
      }
  
      const response = await fetch(url, {
        method: 'PATCH',
        body: JSON.stringify({ username, password, newPassword, confirmedPassword }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
  
      // Reset form fields and error state on success
      setPassword('');
      setNewPassword('');
      setConfirmedPassword('');
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' ,backgroundColor:"white"}}>
    <Typography variant="h4" align="center" gutterBottom>
      Modifier Votre mot de passe
    </Typography>
    <Divider />
    <form onSubmit={handleUpdate} style={{ marginTop: '20px' }}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12}>
          <TextField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="Password"
            label="Mot de passe actuel"
            variant="outlined"
            size="small"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            id="newPassword"
            label="Nouveau mot de passe"
            variant="outlined"
            size="small"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            value={confirmedPassword}
            onChange={(e) => setConfirmedPassword(e.target.value)}
            id="confirmedPassword"
            label="Confirmer le nouveau mot de passe"
            variant="outlined"
            size="small"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" size="large" fullWidth style={{ backgroundColor: '#4caf50', color: 'white', marginTop: '20px' }}>
            Modifier
          </Button>
        </Grid>
      </Grid>
    </form>
    {error && <div style={{ color: 'red', marginTop: '20px' }}>{error}</div>}
  </div>
  );
};

export default ChangePassForm;
