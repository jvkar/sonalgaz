import React,{ useEffect,useState } from "react"
import { useEtablissementContext } from '../hooks/useEtablissementContext';
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
const BlackListDetails=({blacklist})=>{
  // const {dispatch}=useEtablissementContext()

// const handleClick=async ()=>{
//   const response = await fetch (`api/Etablissements/BlackListDel/${blackList._id}`,{
//     method:'DELETE'
//   });
//   const json =await response.json()
//   if(response.ok){
//     dispatch({type: 'DELETE_ETABLISSEMENT', payload: json})
//     window.location.reload()
//   }
// }
return(
  <React.Fragment>
          <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell align="center">{blacklist?.NumeroEtablissement}</TableCell>
        <TableCell align="center">{blacklist?.Nom} </TableCell>
        <TableCell align="center">{blacklist?.Adresse}</TableCell>
        
        <TableCell align="center"></TableCell>

      </TableRow>
  </React.Fragment>

)}
export default BlackListDetails