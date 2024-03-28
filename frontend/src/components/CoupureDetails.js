import React, { useEffect } from 'react';
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import {useClientContext} from '../hooks/useClientContext'



const CoupureDetails = ({ coupure }) => {



  return (

  
    <React.Fragment>
      <TableRow>

      <TableCell component="th" scope="row">
          {coupure.codeClient}
        </TableCell>
        <TableCell >{coupure.referenceClient}</TableCell>
        <TableCell>{coupure.nomClient}</TableCell>
        <TableCell >{coupure.adresseClient}</TableCell>
        <TableCell >{coupure.numeroCompteur}</TableCell>
        <TableCell >{coupure.typeClient}</TableCell>
        <TableCell >{coupure.etat}</TableCell>

      </TableRow>
    </React.Fragment>
       


  )
}
export default CoupureDetails;
