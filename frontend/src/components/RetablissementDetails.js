import React, { useEffect, useState } from 'react';
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { useClientContext } from '../hooks/useClientContext'



const RetablissementDetails = ({ retablissement }) => {




  return (
    <React.Fragment>
      <TableRow>

        <TableCell component="th" scope="row">
          {retablissement.codeClient}
        </TableCell>
        <TableCell >{retablissement.referenceClient}</TableCell>
        <TableCell>{retablissement.nomClient}</TableCell>
        <TableCell >{retablissement.adresseClient}</TableCell>
        <TableCell >{retablissement.numeroCompteur}</TableCell>
        <TableCell >{retablissement.typeClient}</TableCell>
        <TableCell >{retablissement.etat}</TableCell>

      </TableRow>
    </React.Fragment>


  )
}
export default RetablissementDetails;
