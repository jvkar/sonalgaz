import React, { useEffect } from 'react';
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { useClientContext } from '../hooks/useClientContext'
import { useAuthContext } from '../hooks/useAuthContext';


const CoupureDetails = ({ coupure }) => {
  const {user} = useAuthContext()
  const userType = user.userType


  return (


    <React.Fragment>
      {userType != "technicien" &&(
      <TableRow>

        <TableCell component="th" scope="row">
          {coupure?.codeClient}
        </TableCell>
        <TableCell >{coupure?.referenceClient}</TableCell>
        <TableCell>{coupure?.nomClient}</TableCell>
        <TableCell >{coupure?.adresseClient}</TableCell>
        <TableCell >{coupure?.numeroCompteur}</TableCell>
        <TableCell >{coupure?.typeClient}</TableCell>
        <TableCell >{coupure?.etat}</TableCell>
        {userType==="CadreAgence"?
        <TableCell style={{ color: coupure?.archived === 'archiver' ? 'green' : 'red' }}>
          {coupure?.archived}
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
export default CoupureDetails;
