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
const ArchiveListeEntreprise = ({ etablissement }) => {


  return (
      <React.Fragment>


        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell align="center">{etablissement?.NumeroEtablissement} </TableCell>
          <TableCell align="center">{etablissement?.Nom}</TableCell>

          <TableCell align="center">{etablissement?.affectationCoupure}</TableCell>

          <TableCell align="center">{etablissement?.affectationRetablissement}</TableCell>
          <TableCell align="center">{etablissement?.timesInBlackList}</TableCell>
        </TableRow>
      </React.Fragment>

  );
};

export default ArchiveListeEntreprise;
