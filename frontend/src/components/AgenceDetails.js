import * as React from "react";
import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CircularProgress from "@mui/material/CircularProgress";
import ModelUpdateAgence from "./models/modelUpdateAgence";
import { Button, FormControlLabel, Switch } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAgenceContext } from "../hooks/useAgenceContext";

const AgenceDetails = ({ agence }) => {
  const [agenceDetails, setAgenceDetails] = useState(agence);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthContext();
  const [open, setOpen] = React.useState(false);
  const [assignedEtablissements, setAssignedEtablissements] = React.useState([]);
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEtablissementsData = async () => {
      try {
        const response = await fetch(`/api/Etablissements/etablissement/${agence._id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const json = await response.json();
        if (response.ok) {
          setAssignedEtablissements(json);
        } else {
          setError(json.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (user) {
      fetchEtablissementsData();
    }
  }, [agence._id, user]);

  const updateState = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`/api/Agences/stateChange/${agence._id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();
      if (response.ok) {
        setAgenceDetails(json);
      } else {
        setError(json.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (error) {
      const timeoutId = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [error]);
  const updateUrl = (id) => {
    navigate(`?id=${id}`);
  };
  return (
    <React.Fragment>
      {error && <div className="error">{error}</div>}
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center">{agence?.numeroAgence}</TableCell>
        <TableCell align="center">{agence?.nom}</TableCell>
        <TableCell align="center">{agence?.adresseAgence}</TableCell>
        <TableCell align="center">
          <div style={{ paddingRight: "10px" }}>
            <ModelUpdateAgence agenceId={agence._id} updateUrl={updateUrl} />
            <FormControlLabel
              control={
                <Button onClick={updateState} disableRipple>
                  <Switch checked={agenceDetails.state === "active"} />
                </Button>
              }
              label={agenceDetails.state === "active" ? "active" : "inactive"}
            />
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, backgroundColor: "#eeeeee" }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Entreprises de {agence?.nom}
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Numéro</TableCell>
                    <TableCell align="center">Nom</TableCell>
                    <TableCell align="center">Adresse</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : assignedEtablissements.length ? (
                    assignedEtablissements.map((etablissement) => (
                      <TableRow key={etablissement.id}>
                        <TableCell align="center">{etablissement.NumeroEtablissement}</TableCell>
                        <TableCell align="center">{etablissement.Nom}</TableCell>
                        <TableCell align="center">{etablissement.Adresse}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        Pas de données disponibles
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default AgenceDetails;
