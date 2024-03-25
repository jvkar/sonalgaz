import React, { useEffect } from 'react';
import {useClientContext} from '../hooks/useClientContext'



const CoupureDetails = ({ client }) => {



  return (

  
        <tbody>
          <tr>
        <td>{client?.codeClient}</td>
          <td>{client?.referenceClient}</td>
          <td>{client?.nomClient}</td>
          <td>{client?.adresseClient}</td>
          <td>{client?.typeClient}</td>
          <td>{client?.numeroCompteur}</td>
          <td>{client?.etat}</td>
          </tr>
       </tbody>
       


  )
}
export default CoupureDetails;
