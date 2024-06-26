import { useEffect, useState } from "react";
import EtablissementDetails from "../components/EtablissementDetail";
import { useEtablissementContext } from "../hooks/useEtablissementContext";
import { useAuthContext } from "../hooks/useAuthContext";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import { useParams } from 'react-router-dom';

const EtabAgence = () => {
  const { user } = useAuthContext();
  const { etablissements, dispatch } = useEtablissementContext();
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchEtablissement = async () => {
      const response = await fetch(`/api/Etablissements/etablissement/${id}`, {
        headers: { 'Authorization': `Bearer ${user.token}` },
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: 'SET_ETABLISSEMENT', payload: json });
        setIsLoading(false);
      }
    };
    if (user && user.userType === "CadreAgence") {
      fetchEtablissement();
    }
  }, [dispatch, id, user]);

  return (
    <div className="list">
      <div className='Title'>
        <h1>La Liste des Entreprise</h1>
      </div>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell align="center"></TableCell>
              <TableCell align="center">Numéro de l'entreprise</TableCell>
              <TableCell align="center">Nom de l'entreprise</TableCell>
              <TableCell align="center">Adresse De l'entreprise</TableCell>
              <TableCell align="center">Nombre de fois dans la liste noire</TableCell>
              <TableCell align="center">nombre de coupures dans {new Date().getFullYear()}</TableCell>
              <TableCell align="center">nombre de retablissements dans {new Date().getFullYear()}</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                <CircularProgress style={{ margin: "15px" }} />
              </TableRow>
            ) : (
              etablissements && etablissements.map(etablissement => (
                <EtablissementDetails key={etablissement._id} etablissement={etablissement} />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default EtabAgence;
