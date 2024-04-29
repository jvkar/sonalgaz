import React,{ useEffect,useState } from "react"
import { useEtablissementContext } from '../hooks/useEtablissementContext';
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
const BlackListDetails=({blacklist})=>{
  const timestamp = `${blacklist.createdAt}`;
  const date = new Date(timestamp);
  

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const day = String(date.getDate()).padStart(2, '0'); 
  

  const dateString = `${year}-${month}-${day}`;
return(
  <React.Fragment>
          <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell align="center">{blacklist?.NumeroEtablissement}</TableCell>
        <TableCell align="center">{blacklist?.Nom} </TableCell>
        <TableCell align="center">{blacklist?.Adresse}</TableCell>
        <TableCell align="center">{dateString}</TableCell>
        
        <TableCell align="center"></TableCell>

      </TableRow>
  </React.Fragment>

)}
export default BlackListDetails