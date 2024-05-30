import { useState, useEffect } from "react";
import { useEtablissementContext } from "../hooks/useEtablissementContext";
import { useAuthContext } from "../hooks/useAuthContext";
import * as React from "react";
import IconButton from "@mui/material/IconButton";
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
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SnackBar from "./SnackBar";
import Archiver from "../components/buttons/archiveButton";
import ModelUpdateEntreprise from "./models/modelUpdateEntreprise";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import ModelArchive from "./models/modelArchive";
import ModelArchiveEntreprise from "./models/modelArchiveEntreprise";
const ArchiveListeClient = ({ client }) => {


  return (
      <React.Fragment>


        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell align="center">{client?.codeClient}</TableCell>
          <TableCell align="center">{client?.referenceClient} </TableCell>
          <TableCell align="center">{client?.nomClient}</TableCell>

          <TableCell align="center">{client?.adresseClient}</TableCell>

          <TableCell align="center">{client?.numeroCompteur}</TableCell>
          <TableCell align="center">{client?.typeClient}</TableCell>
          <TableCell align="center">{client?.etat}</TableCell>
        </TableRow>
      </React.Fragment>

  );
};

export default ArchiveListeClient;
