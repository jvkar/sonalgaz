import React, { useEffect, useState } from 'react';
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { useClientContext } from '../hooks/useClientContext'
import { useAuthContext } from '../hooks/useAuthContext';


const RetablissementDetails = ({ retablissement }) => {
   const {user} = useAuthContext()
   const userType= user.userType



  return (
    <React.Fragment>
    {userType != "technicien" &&(
      <TableRow>

        <TableCell component="th" scope="row">
          {retablissement?.codeClient}
        </TableCell>
        <TableCell >{retablissement?.referenceClient}</TableCell>
        <TableCell>{retablissement?.nomClient}</TableCell>
        <TableCell >{retablissement?.adresseClient}</TableCell>
        <TableCell >{retablissement?.numeroCompteur}</TableCell>
        <TableCell >{retablissement?.typeClient}</TableCell>
        <TableCell >{retablissement?.etat}</TableCell>
        {userType==="CadreAgence"?
        <TableCell style={{ color: retablissement?.archived === 'archiver' ? 'green' : 'red' }}>
          {retablissement?.archived}
        </TableCell>
        :
        <>
        </>
        }

      </TableRow>
      )}
    </React.Fragment>


  )
}
export default RetablissementDetails;
