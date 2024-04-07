import React, { useEffect, useState } from "react";
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
import "../index.css";
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";
import { LuPencilLine } from "react-icons/lu";
import { Margin } from "@mui/icons-material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ClientForme from "../components/ClientForm";
import { useAuthContext } from "../hooks/useAuthContext";
import { useParams } from "react-router-dom";
import ModelAddClient from "../components/models/modeAddClient";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
const Client = () => {
  const { user } = useAuthContext();
  const Nom = user?.nom;
  const { clients, dispatch } = useClientContext();
  const { id } = useParams();
  const [open, setOpen] = React.useState(false);
  const [filterType, setFilterType] = useState("all"); // State variable to manage the filter type

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coupureResponse = await fetch(`/api/Clients/coupures/${id}`);
        const retablissementResponse = await fetch(
          `/api/Clients/retablissements/${id}`
        );

        if (coupureResponse.ok && retablissementResponse.ok) {
          const coupureJson = await coupureResponse.json();
          const retablissementJson = await retablissementResponse.json();

          dispatch({ type: "SET_COUPURE_CLIENTS", payload: coupureJson });
          dispatch({
            type: "SET_RETABLISSEMENT_CLIENTS",
            payload: retablissementJson,
          });
        } else {
          console.error(
            "Error fetching data:",
            coupureResponse.statusText,
            retablissementResponse.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  // Function to filter clients based on the selected filter type
  const filterClients = (client) => {
    if (filterType === "archiver") {
      return client.archived === "archiver";
    } else if (filterType === "Non Archiver") {
      return client.archived === "Non Archiver";
    } else {
      return true; // Show all clients
    }
  };
  const handleChange = (event) => {
    setFilterType(event.target.value);
  };
  return (
    <div className="list">
      <React.Fragment>
        <div className="Title" style={{ marginBottom: "20px" }}>
          <h1>la liste des clients de l'agence de {Nom}</h1>
          <div className="AddBtt">
            <ModelAddClient />
          </div>
        </div>


        <FormControl>
          <InputLabel id="demo-simple-select-label">Archive</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={filterType}
            label="archive"
            onChange={handleChange}
          >
            <MenuItem value={"all"}>
              {" "}

                All Clients
            </MenuItem>
            <MenuItem value={"archiver"}>
              {" "}
             
                Archived Clients

            </MenuItem>
            <MenuItem value={"Non Archiver"}>
              {" "}

                Not Archived Clients

            </MenuItem>
          </Select>
        </FormControl>

        <Accordion style={{ backgroundColor: "#FFFFFF" }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Les coupure de l'agence
          </AccordionSummary>
          <AccordionDetails>
            <Table size="small" aria-label="purchases">
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Reference</TableCell>
                  <TableCell>Nom</TableCell>
                  <TableCell>Adresse</TableCell>
                  <TableCell>Numero compteur</TableCell>
                  <TableCell>Type client</TableCell>
                  <TableCell>Etat</TableCell>
                  <TableCell>Archiver</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {clients?.coupures &&
                  clients?.coupures
                    .filter(filterClients)
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
          <AccordionDetails>
            <Table size="small" aria-label="purchases">
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Reference</TableCell>
                  <TableCell>Nom</TableCell>
                  <TableCell>Adresse</TableCell>
                  <TableCell>Numero compteur</TableCell>
                  <TableCell>Type client</TableCell>
                  <TableCell>Etat</TableCell>
                  <TableCell>Archiver</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {clients?.retablissements &&
                  clients?.retablissements
                    .filter(filterClients)
                    .map((client) => (
                      <RetablissementDetails
                        key={client._id}
                        retablissement={client}
                      />
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
