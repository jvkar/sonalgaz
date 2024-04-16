import React, { useEffect } from "react";
import CoupureDetails from "../components/CoupureDetails";
import RetablissementDetails from "../components/RetablissementDetails";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";

import TableRow from "@mui/material/TableRow";

import TableHead from "@mui/material/TableHead";

import '../index.css'

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useAuthContext } from "../hooks/useAuthContext"; 
import { useParams } from 'react-router-dom';


const ClientTech = () => {
  const {user} = useAuthContext()
  const Nom = user?.nom

  const { id } = useParams()

  const [assignedCoupure, setassignedCoupure] = React.useState([])
  const [assignedRetab, setassignedRetab] = React.useState([])

  useEffect(() => {
    const fetchCoupureData = async () => {
      const response = await fetch(`/api/Techniciens/coupurePerEtab/${id}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      })
      const json = await response.json();
      if (response.ok) {
        setassignedCoupure(json);
      }
    }
    if (user) {
      fetchCoupureData()
    }
  }, [assignedCoupure, user,id]);
  useEffect(() => {
    const fetchRetabData = async () => {
      const response = await fetch(`/api/Techniciens/retabPerEtab/${id}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      })
      const json = await response.json();
      if (response.ok) {
        setassignedRetab(json);
      }
    }
    if (user) {
      fetchRetabData()
    }
  }, [assignedRetab, user,id]);

  return (
    <div className="list">
    <React.Fragment >
          <div className='Title' style={{marginBottom:"20px"}}>
            <h1>la liste des clients de {Nom}</h1>

          </div>

              <Accordion style={{ backgroundColor: "#FFFFFF" }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  Les coupure du technicien
                </AccordionSummary>
                <AccordionDetails>
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <TableRow>
                      <TableCell>Code</TableCell>

                        <TableCell>Nom</TableCell>

                        <TableCell >Etat</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                        {assignedCoupure && assignedCoupure?.map((coupure, index) => (
                        <CoupureDetails key={index} coupure={coupure} />
                        ))}
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
                  Les retablissements du technicien
                </AccordionSummary>
                <AccordionDetails>
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <TableRow>
                        <TableCell>Code</TableCell>

                        <TableCell>Nom</TableCell>

                        <TableCell >Etat</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                        {assignedRetab && assignedRetab?.map((retablissement, index) => (

                        <RetablissementDetails key={index} retablissement={retablissement} />

                        ))}
                      </TableBody>
                  </Table>
                </AccordionDetails>
              </Accordion>




      {/* 
      <div>
        <ClientForme/>
      </div> */}
    </React.Fragment>
    
</div>
  );
}

export default ClientTech;
