import React,{ useEffect,useState } from "react"
import { useEtablissementContext } from '../hooks/useEtablissementContext';

const BlackListDetails=({blackList})=>{
  const {dispatch}=useEtablissementContext()

const handleClick=async ()=>{
  const response = await fetch (`api/Etablissements/BlackListDel/${blackList._id}`,{
    method:'DELETE'
  });
  const json =await response.json()
  if(response.ok){
    dispatch({type: 'DELETE_ETABLISSEMENT', payload: json})
    window.location.reload()
  }
}
return(
<table>
        <tr>
            <td>{blackList?.Nom}</td>
            <td>{blackList?.NumeroEtablissement}</td>
            <td>{blackList?.Adresse}</td>
        </tr>
          
        </table>
)}
export default BlackListDetails