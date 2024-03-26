import React,{ useEffect,useState } from "react"
import { useEtablissementContext } from '../hooks/useEtablissementContext';

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
<table>
        <tr>
            <td>{blacklist?.Nom}</td>
            <td>{blacklist?.NumeroEtablissement}</td>
            <td>{blacklist?.Adresse}</td>
        </tr>
          
        </table>
)}
export default BlackListDetails