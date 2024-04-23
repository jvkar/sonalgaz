import React, { useEffect, useState } from "react";
import { useCreateAccount } from "../hooks/useCreateAccount";
import { useAuthContext } from "../hooks/useAuthContext";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

import Select from "@mui/material/Select";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import { useAgenceContext } from "../hooks/useAgenceContext";
import { useEtablissementContext } from "../hooks/useEtablissementContext"

const CreerCompteForm = () => {
  const { user } = useAuthContext();
  const [agence, setAgence] = useState(true);
  const [entreprise, setEntreprise] = useState(false);
  const [nomCadre, setNomCadre] = useState("");
  const [nomResponsable, setNomResponsable] = useState("");
  const [numeroAgence, setNumeroAgence] = useState("");
  const [NumeroEtablissement, setNumeroEtablissement] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error2, setError] = useState(undefined);
  const { etabCreateAccount, agenceCreateAccount, error, isLoading } =
    useCreateAccount();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setIsLoading] = useState(true);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleClear = (e) => {
    e.preventDefault();
    setNumeroAgence("");
    setNumeroEtablissement("");
    setAgence(true);
    setEntreprise(false);
    setUsername("");
    setPassword("");
    setNomCadre("");
    setNomResponsable("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in");
      return;
    }

    let userType = "";
    let numeroKey = "";
    if (agence != "") {
      userType = "agence";
      numeroKey = "numeroAgence";
    } else if (entreprise != "") {
      userType = "entreprise";
      numeroKey = "NumeroEtablissement";
    }
    const headers = { Authorization: `Bearer ${user.token}` };
    userType === "agence"
      ? await agenceCreateAccount(
          nomCadre,
          numeroAgence,
          username,
          password,
          headers
        )
      : await etabCreateAccount(
          nomResponsable,
          NumeroEtablissement,
          username,
          password,
          headers
        );
    handleClear(e);
  };
  const { agences, dispatch:AgenceDispatch } = useAgenceContext();
  useEffect(() => {
    const fetchAgences = async () => {
      const response = await fetch("/api/Agences", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();

      if (response.ok) {
        AgenceDispatch({ type: "SET_AGENCE", payload: json });

        setIsLoading(false);
      }
    };

    if (user && user.userType == "admin") {
      fetchAgences();
    }
  }, [AgenceDispatch, user]);
  const { etablissements, dispatch:EntrepriseDispatch } = useEtablissementContext()
  useEffect(() => {
    const fetchEtablissement = async () => {
      const response = await fetch('/api/Etablissements/', {
        headers: { 'Authorization': `Bearer ${user.token}` },
      })
      const json = await response.json()

      if (response.ok) {
        EntrepriseDispatch({ type: 'SET_ETABLISSEMENT', payload: json })
        setIsLoading(false)

      }
    }
    if (user && user.userType == "admin") {
      fetchEtablissement()
    }
  }, [EntrepriseDispatch, user])
  return (
    <div>
      <Box sx={{ m: 2 }} />
      <Typography variant="h4" align="center">
        Créer des comptes
      </Typography>
      <Divider />
      <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
      <img
              style={{
                display: "block",
                padding:"20px"
              }}
              src={require("../images/myImage.png")}
              alt="sonelgaz logo"
              width="150px"
              height="200px"
            />
      <RadioGroup
                style={{
                  paddingTop: "20 px",
                  paddingBottom: "15px",
                  paddingLeft: "25px",
                }}
                row
              >
                <FormControlLabel
                  value="agence"
                  checked={agence}
                  onChange={(e) => {
                    setAgence(true);
                    setEntreprise(false);
                  }}
                  control={<Radio />}
                  label="Agence"
                />
                <FormControlLabel
                  value="entreprise"
                  checked={entreprise}
                  onChange={(e) => {
                    setAgence(false);
                    setEntreprise(true);
                  }}
                  sx={{ paddingLeft: "25px" }}
                  control={<Radio />}
                  label="Entreprise"
                />
              </RadioGroup>
        <Grid container style={{flexDirection:"column",padding: "15px"}}>
          <Grid item xs={6} sx={{ padding: "15px" ,margin:"0 auto"}}>

            <FormControl fullWidth>
              <InputLabel id="select-label">
                {agence ? "Agence" : "Entreprise"}{" "}

              </InputLabel>
              <Select
                labelId="select-label"
                id="select"
                value={agence ? numeroAgence : NumeroEtablissement}
                onChange={(e) => {
                  if (agence) {
                    setNumeroAgence(e.target.value);
                  } else {
                    setNumeroEtablissement(e.target.value);
                  }
                }}
                label="Numéro (Agence/Entreprise)"
                variant="outlined"
                size="small"
                sx={{ minWidth: "100%", paddingBottom: "10px",marginBottom:"20px" }}
              >

                {(agence ? agences : etablissements)?.map((item) => (
                  <MenuItem key={item._id} value={agence? item.numeroAgence:item.NumeroEtablissement}>
                    {agence ? item.nom:item.Nom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              id="nom"
              label={agence ? "Nom Cadre Agence" : "Nom responsable entreprise"}
              value={agence ? nomCadre : nomResponsable}
              onChange={(e) => {
                setNomCadre(agence ? e.target.value : nomCadre);
                setNomResponsable(entreprise ? e.target.value : nomResponsable);
              }}
              variant="outlined"
              siz="small"
              sx={{ minWidth: "100%", paddingBottom: "30px" ,lineHeight:"0px"}}
            />
            <TextField
              id="Username"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              variant="outlined"
              siz="small"
              sx={{ minWidth: "100%", paddingBottom: "30px" }}
            />
            <FormControl
              siz="small"
              variant="outlined"
              sx={{ minWidth: "100%", paddingBottom: "30px" }}
            >
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6} sx={{ margin: "0 auto" }}>

            <FormControl>

              <Stack
                direction="row"
                spacing={2}
                sx={{ }}
              >
                <Button type="submit" disabled={isLoading} variant="contained">
                  {" "}
                  Créer{" "}
                </Button>
              </Stack>
            </FormControl>
          </Grid>
        </Grid>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default CreerCompteForm;
