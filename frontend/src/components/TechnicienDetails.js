import React, { useEffect } from 'react';
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { useAuthContext } from '../hooks/useAuthContext';


const TechnicienDetails = ({ technicien }) => {
  const {user} = useAuthContext()
  const userType = user.userType


  return (


    <React.Fragment>
      <TableRow>

        <TableCell component="th" scope="row">
          {technicien.codeTechnicien}
        </TableCell>

        <TableCell>{technicien.nomTechnicien}</TableCell>
        <TableCell >{technicien.username}</TableCell>
        <TableCell ></TableCell>


      </TableRow>
    </React.Fragment>



  )
}
export default TechnicienDetails;
