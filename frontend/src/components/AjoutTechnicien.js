import { useAuthContext } from "../hooks/useAuthContext";
import { useCreateAccount } from "../hooks/useCreateAccount";
import { useState } from "react";
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
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import { MdAddToPhotos } from "react-icons/md";
import Alert from "@mui/material/Alert";
const AjoutTechnicienForm = () => {
  const { user } = useAuthContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nomTechnicien, setNomTechnicien] = useState("");
  const [codeTechnicien, setCodeTechnicien] = useState("");
  const [nbrInterventions, setNbrInterventions] = useState("");
  const {
    technicienCreateAccount,
    etabCreateAccount,
    agenceCreateAccount,
    error,
    isLoading,
  } = useCreateAccount();
  const [error2, setError] = useState(undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const headers = { Authorization: `Bearer ${user.token}` };
    await technicienCreateAccount(
      nomTechnicien,
      codeTechnicien,
      nbrInterventions,
      username,
      password,
      headers
    );
  };
  return (
    <div>
      <Box sx={{ m: 2 }} />
      <Typography variant="h4" align="center">
        Créer des comptes Techniciens
      </Typography>
      <Divider />

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          style={{
            display: "block",
            padding: "20px",
          }}
          src={require("../images/myImage.png")}
          alt="sonelgaz logo"
          width="150px"
          height="200px"
        />
        <Grid container style={{ flexDirection: "column", padding: "15px" }}>
          <Grid item xs={6} sx={{ padding: "15px", margin: "0 auto" }}>
            <TextField
              id="codeTechnicien"
              type="number"
              value={codeTechnicien}
              onChange={(e) => setCodeTechnicien(e.target.value)}
              label="code Technicien"
              variant="outlined"
              siz="small"
              sx={{ minWidth: "100%", paddingBottom: "30px" }}
            />
            <TextField
              id="nomTechnicien"
              type="text"
              value={nomTechnicien}
              onChange={(e) => setNomTechnicien(e.target.value)}
              label="Nom Technicien"
              variant="outlined"
              siz="small"
              sx={{ minWidth: "100%", paddingBottom: "30px" }}
            />
            <TextField
              id="nbrInterventions"
              type="text"
              value={nbrInterventions}
              onChange={(e) => setNbrInterventions(e.target.value)}
              label="Nombre des Interventions affecter"
              variant="outlined"
              siz="small"
              sx={{ minWidth: "100%", paddingBottom: "30px" }}
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

export default AjoutTechnicienForm;
