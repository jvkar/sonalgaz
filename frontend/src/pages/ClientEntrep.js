import React, { useEffect, useState } from "react";
import CoupureDetails from "../components/CoupureDetails";
import RetablissementDetails from "../components/RetablissementDetails";
import { useAuthContext } from "../hooks/useAuthContext"; 
import { useParams } from 'react-router-dom';
import { Accordion, AccordionDetails, AccordionSummary, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ClientEntrep = () => {
  const { user } = useAuthContext();
  const { id } = useParams();
  const [assignedCoupure, setAssignedCoupure] = useState([]);
  const [assignedRetab, setAssignedRetab] = useState([]);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    const fetchCoupureData = async () => {
      const response = await fetch(`/api/Clients/coupurePerEtab/${id}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const json = await response.json();
      if (response.ok) {
        const allClients = json.flatMap(enterprise => enterprise.clients);
        setAssignedCoupure(allClients);
      } else {
        setError(json.error);
      }
    };
    if (user) {
      fetchCoupureData();
    }
  }, [id, user]);

  useEffect(() => {
    const fetchRetabData = async () => {
      const response = await fetch(`/api/Clients/retabPerEtab/${id}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const json = await response.json();
      if (response.ok) {
        const allClients = json.flatMap(enterprise => enterprise.clients);
        setAssignedRetab(allClients);
      } else {
        setError(json.error);
      }
    };
    if (user) {
      fetchRetabData();
    }
  }, [id, user]);

  return (
    <div className="list">
      {error && <div className="error">{error}</div>}
      <div className='Title' style={{marginBottom:"20px"}}>
        <h1>La liste des clients de l'entreprise</h1>
      </div>

      <Accordion style={{ backgroundColor: "#FFFFFF" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Les coupures de l'entreprise
        </AccordionSummary>
        <AccordionDetails>
          <Table size="small" aria-label="purchases">
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Reference</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell >Adresse</TableCell>
                <TableCell >Numero compteur</TableCell>
                <TableCell >Type client</TableCell>
                <TableCell >Etat</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignedCoupure.length!==0 ?( assignedCoupure.map((coupure, index) => (
                <CoupureDetails key={index} coupure={coupure} />
              ))):(<h1>There's no data</h1>)}
            </TableBody>
          </Table>
        </AccordionDetails>
      </Accordion>

      <Accordion style={{ backgroundColor: "#FFFFFF" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Les rétablissements de l'entreprise
        </AccordionSummary>
        <AccordionDetails>
          <Table size="small" aria-label="purchases">
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Reference</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell >Adresse</TableCell>
                <TableCell >Numero compteur</TableCell>
                <TableCell >Type client</TableCell>
                <TableCell >Etat</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignedRetab.length!==0 ? (assignedRetab.map((retablissement, index) => (
                <RetablissementDetails key={index} retablissement={retablissement} />
              ))):(<h1>There's no data</h1>)}
            </TableBody>
          </Table>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default ClientEntrep;
