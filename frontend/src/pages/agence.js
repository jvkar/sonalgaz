import { useEffect, useState } from "react";
import AgenceDetails from "../components/AgenceDetails";
import { useAgenceContext } from "../hooks/useAgenceContext";
import { useAuthContext } from '../hooks/useAuthContext';
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import ModelAdd from "../components/models/modelAdd";

const Agences = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { agences, dispatch } = useAgenceContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchAgences = async () => {
      const response = await fetch('/api/Agences', {
        headers: { 'Authorization': `Bearer ${user.token}` },
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: 'SET_AGENCE', payload: json });
        setIsLoading(false);
      }
    };
    
    if (user && user.userType === "admin") {
      fetchAgences();
    }
  }, [dispatch, user]);

  return (
    <div className="list">
      <div className='Title'>
        <h1>La Liste des Agences</h1>
        <div className='AddBtt'>
          <ModelAdd />
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align="center">Numéro de l'Agence</TableCell>
              <TableCell align="center">Nom de l'agence</TableCell>
              <TableCell align="center">Adresse De l'agence</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow style={{display:"flex",justifyContent:"center",alignItems:"center",width:"100%"}}>
                <CircularProgress style={{margin:"15px"}}/>
              </TableRow>
            ) : (
              agences && agences.map(agence => (
                <AgenceDetails key={agence._id} agence={agence} />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Agences;
