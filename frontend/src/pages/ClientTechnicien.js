import React, { useEffect,useState } from "react";
import CoupureDetails from "../components/CoupureDetails";
import RetablissementDetails from "../components/RetablissementDetails";
import { useClientContext } from "../hooks/useClientContext";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import TableHead from "@mui/material/TableHead";
import { BsArrowRightCircle } from "react-icons/bs";
import { BsArrowRightCircleFill } from "react-icons/bs";
import '../index.css'
import Paper from "@mui/material/Paper";
import { Button } from '@mui/material';
import { LuPencilLine } from "react-icons/lu";
import { Margin } from '@mui/icons-material';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ClientForme from "../components/ClientForm";
import { useAuthContext } from "../hooks/useAuthContext"; 
import { useParams } from 'react-router-dom';
import ModelAddClient from "../components/models/modeAddClient";

const ClientTech = () => {
  const {user} = useAuthContext()
  const Nom = user?.nom
  const { clients, dispatch } = useClientContext();
  const { id } = useParams()
  const [open, setOpen] = React.useState(false);
  const [assignedCoupure, setassignedCoupure] = React.useState([])
  const [assignedRetab, setassignedRetab] = React.useState([])
  const [error, setError] = useState(undefined)
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
  }, [assignedCoupure, user]);
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
  }, [assignedRetab, user]);

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
                        <TableCell>Reference</TableCell>
                        <TableCell>Nom</TableCell>
                        <TableCell >Adresse</TableCell>
                        <TableCell >Numero compteur</TableCell>
                        <TableCell >Type client</TableCell>
                        <TableCell >Etat</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                        {assignedCoupure && assignedCoupure?.map((coupure, index) => (
                        //   <TableRow key={index}>
                        //     <TableCell component="th" scope="row">
                        //       {coupure.codeClient}
                        //     </TableCell>
                        //     <TableCell>{coupure.nomClient}</TableCell>
                        //     <TableCell align="right">{coupure.adresseClient}</TableCell>
                        //   </TableRow>
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
                        <TableCell>Reference</TableCell>
                        <TableCell>Nom</TableCell>
                        <TableCell >Adresse</TableCell>
                        <TableCell >Numero compteur</TableCell>
                        <TableCell >Type client</TableCell>
                        <TableCell >Etat</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                        {assignedRetab && assignedRetab?.map((retablissement, index) => (
                        //   <TableRow key={index}>
                        //     <TableCell component="th" scope="row">
                        //       {retablissement.codeClient}
                        //     </TableCell>
                        //     <TableCell>{retablissement.nomClient}</TableCell>
                        //     <TableCell align="right">{retablissement.adresseClient}</TableCell>
                        //   </TableRow>
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
