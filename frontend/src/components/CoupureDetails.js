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

      <TableRow>

        <TableCell component="th" scope="row">
          {coupure?.codeClient}
        </TableCell>
        {userType != 'technicien' &&(
          
        <TableCell >{coupure?.referenceClient}</TableCell>
        )}
        <TableCell>{coupure?.nomClient}</TableCell>
        {userType != 'technicien' &&(
          
        <TableCell >{coupure?.adresseClient}</TableCell>
        )}
        {userType != 'technicien' &&(
          <TableCell >{coupure?.numeroCompteur}</TableCell>
          
        )}
        {userType != 'technicien' &&(
          
        <TableCell >{coupure?.typeClient}</TableCell>
        )}
        <TableCell style={{ color: coupure?.etat === 'valider' ? 'green' : coupure?.etat === 'invalider' ? 'red' : 'blue' }} >
          {coupure?.etat}
          </TableCell>
        {userType==="CadreAgence"?
        <TableCell style={{ color: coupure?.archived === 'archiver' ? 'green' : 'red' }}>
          {coupure?.archived}
        </TableCell>
        :
        <>
        </>
        }

      </TableRow>

    </React.Fragment>



  )
}
export default CoupureDetails;
