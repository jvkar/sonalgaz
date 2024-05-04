import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import React from "react";
import { IoIosClose } from "react-icons/io";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useEtablissementContext } from "../../hooks/useEtablissementContext";
import { useAuthContext } from "../../hooks/useAuthContext";
const FormAddEntrepriseCSV = ({ closeEvent }) => {
  const { dispatch } = useEtablissementContext();
  const { user } = useAuthContext();
  const [NombreDesCoupures, setNombreDesCoupures] = useState("");
  const [file, setFile] = useState(undefined);
  const [error, setError] = useState(null);
  const [importing, setImporting] = useState(false);
  const [etablissement, setEtablissement] = useState([]);

  const handleSubmit = async (e) => {
    setImporting(true);
    e.preventDefault();
    if (!user) {
      setError("you must be logged in");
      return;
    }
    const etablissement = { file };
    if (file === null || file === undefined) {
      console.log("Veuillez choisir un fichier");
    } else {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("NombreDesCoupures", NombreDesCoupures);

      const response = await fetch("/api/Etablissements/add", {
        method: "POST",
        body: formData,

        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
      }
      if (response.ok) {
        setError(null);
        setEtablissement(json);
        setFile(undefined);
        setImporting(false);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box sx={{ m: 2 }} />
        <Typography variant="h5" align="center">
          Ajouter liste des entreprise (format CSV)
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
              id="NombreDesCoupures"
              value={NombreDesCoupures}
              type="number "
              onChange={(e) => setNombreDesCoupures(e.target.value)}
              label="le nombre des coupures/ retablissement par entreprise "
              variant="outlined"
              siz="small"
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
};

export default FormAddEntrepriseCSV;
