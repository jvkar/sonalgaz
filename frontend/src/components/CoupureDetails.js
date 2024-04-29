import React, { useEffect } from 'react';
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { useClientContext } from '../hooks/useClientContext'
import { useAuthContext } from '../hooks/useAuthContext';
import CauseModal from './models/causeModal';
import { useNavigate } from 'react-router-dom';

const CoupureDetails = ({ coupure }) => {
  const {user} = useAuthContext()
  const userType = user.userType
  const navigate = useNavigate();
  const updateUrl = (id) => {
    navigate(`?id=${id}`);
  };

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
        {userType==="CadreAgence"?
        <TableCell style={{ color: coupure?.archived === 'archiver' ? 'green' : 'red' }}>
          {coupure?.archived}
        </TableCell>
        :
        <>
        </>
        }
        <TableCell style={{ color: coupure?.etat === 'valider' ? 'green' : coupure?.etat === 'invalider' ? 'red' : 'blue' }} >
          {coupure?.etat}
          </TableCell>
        {coupure.etat==="invalider"&&(

        <TableCell>
                        {
                <CauseModal
                  clientId={coupure._id}
                  updateUrl={updateUrl}
                />
              }
        </TableCell>
        )}
      </TableRow>

    </React.Fragment>



  )
}
export default CoupureDetails;
