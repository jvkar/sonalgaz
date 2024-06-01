import React, { useEffect, useState } from "react";
import CoupureDetails from "../components/CoupureDetails";
import RetablissementDetails from "../components/RetablissementDetails";
import { useClientContext } from "../hooks/useClientContext";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAuthContext } from "../hooks/useAuthContext";
import { useParams } from "react-router-dom";
import ModelAddClient from "../components/models/modeAddClient";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Button } from "@mui/material";

const Client = () => {
  const { user } = useAuthContext();
  const Nom = user?.nom;
  const { clients, dispatch } = useClientContext();
  const { id } = useParams();
  const [filterType, setFilterType] = useState("all");
  const [stateFilterType, setStateFilterType] = useState("all");
  const [downloading, setDownloading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coupureResponse = await fetch(`/api/Clients/coupures/${id}`);
        const retablissementResponse = await fetch(`/api/Clients/retablissements/${id}`);

        if (coupureResponse.ok && retablissementResponse.ok) {
          const coupureJson = await coupureResponse.json();
          const retablissementJson = await retablissementResponse.json();

          dispatch({ type: "SET_COUPURE_CLIENTS", payload: coupureJson });
          dispatch({ type: "SET_RETABLISSEMENT_CLIENTS", payload: retablissementJson });
        } else {
          console.error("Error fetching data:", coupureResponse.statusText, retablissementResponse.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dispatch, id]);

  const downloadPDFcoupure = async(e) => {
    e.preventDefault();
    setDownloading(true)
    setMessage('');

    try {
      const response = await fetch(`/api/Clients/export-pdf/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
        },
      });

      if (response.ok) {
        setDownloading(false)
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'archived-clients.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        setDownloading(false)
        const errorData = await response.json();
        setMessage(errorData.message || 'erreur lors de generation du Rapport');
      }
    } catch (error) {
      setMessage('erreur lors de generation du Rapport');
    }
  };

  const filterClients = (client) => {
    if (filterType === "archiver") {
      return client.archived === "archiver";
    } else if (filterType === "Non Archiver") {
      return client.archived === "Non Archiver";
    } else {
      return true;
    }
  };

  const filterClients2 = (client) => {
    if (stateFilterType === "valider") {
      return client.etat === "valider";
    } else if (stateFilterType === "invalider") {
      return client.etat === "invalider";
    } else if (stateFilterType === "en attente") {
      return client.etat === "en attente";
    } else {
      return true;
    }
  };

  return (
    <div className="list">
      {message && <div className="message">{message}</div>}
      <React.Fragment>
        <div className="Title" style={{ marginBottom: "20px" }}>
          <h1>la liste des clients de l'agence de {Nom}</h1>
          <div className="AddBtt">
            <Button variant="contained" endIcon={<FileUploadIcon/>} onClick={downloadPDFcoupure} disabled={downloading} style={{width:"250px",marginRight:"40px"}}>
              {downloading ? "Telechargement..." : "Exporter le rapport"}
            </Button>
            <ModelAddClient />
          </div>
        </div>
        <div style={{ marginBottom: "20px", display:"flex", alignItems:"center" }}>
          <label htmlFor="year">Filtrer par Archive : </label>
          <FormControl sx={{ m: 1, minWidth: 180}}>
            <InputLabel id="demo-simple-select-helper-label">archive</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={filterType}
              label="archive"
              onChange={(e) => setFilterType(e.target.value)}
            >
              <MenuItem value={"archiver"}>archiver</MenuItem>
              <MenuItem value={"Non Archiver"}>non archiver</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div style={{ marginBottom: "20px", display:"flex", alignItems:"center" }}>
          <label htmlFor="type">Filtrer par etat : </label>
          <FormControl sx={{ m: 1, minWidth: 180 }}>
            <InputLabel id="demo-simple-select-helper-label">etat</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={stateFilterType}
              label="etat"
              onChange={(e) => setStateFilterType(e.target.value)}
            >
              <MenuItem value={"en attente"}>en attente</MenuItem>
              <MenuItem value={"valider"}>valider</MenuItem>
              <MenuItem value={"invalider"}>Invalider</MenuItem>
            </Select>
          </FormControl>
        </div>

        <Accordion style={{ backgroundColor: "#FFFFFF" }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Les coupure de l'agence
          </AccordionSummary>
          <AccordionDetails style={{display:"flex",flexDirection:"column",alignItems:"flex-end"}}>
            <Table size="small" aria-label="purchases">
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Reference</TableCell>
                  <TableCell>Nom</TableCell>
                  <TableCell>Adresse</TableCell>
                  <TableCell>Numero compteur</TableCell>
                  <TableCell>Type client</TableCell>
                  <TableCell>Archiver</TableCell>
                  <TableCell>Etat</TableCell>
                  <TableCell>Cause</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clients?.coupures &&
                  clients?.coupures
                    .filter(filterClients)
                    .filter(filterClients2)
                    .map((client) => (
                      <CoupureDetails key={client._id} coupure={client} />
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
            Les retablissements de l'agence
          </AccordionSummary>
          <AccordionDetails style={{display:"flex",flexDirection:"column",alignItems:"flex-end"}}>
            <Table size="small" aria-label="purchases">
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Reference</TableCell>
                  <TableCell>Nom</TableCell>
                  <TableCell>Adresse</TableCell>
                  <TableCell>Numero compteur</TableCell>
                  <TableCell>Type client</TableCell>
                  <TableCell>Archiver</TableCell>
                  <TableCell>Etat</TableCell>
                  <TableCell>Cause</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clients?.retablissements &&
                  clients?.retablissements
                    .filter(filterClients)
                    .filter(filterClients2)
                    .map((client) => (
                      <RetablissementDetails key={client._id} retablissement={client} />
                    ))}
              </TableBody>
            </Table>
          </AccordionDetails>
        </Accordion>
      </React.Fragment>
    </div>
  );
};

export default Client;
