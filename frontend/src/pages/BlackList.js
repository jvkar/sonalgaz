import React, { useEffect } from "react";
import BlackListDetails from "../components/BlackListDetails";
import { useEtablissementContext } from "../hooks/useEtablissementContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useParams } from "react-router-dom";
const BlackList = ({ etablissement }) => {

  const {user}= useAuthContext()
  const {etablissements,dispatch} = useEtablissementContext()
  const {id} = useParams()
  useEffect (()=>{
    const fetchBlackListData=async()=>{
      const response = await fetch(`/api/Etablissements/getBL/${id}`, {
        headers: { 'Authorization': `Bearer ${user.token}` },
      })
      const json=await response.json();
      if(response.ok){

        dispatch({ type: 'SET_ETABLISSEMENT', payload: json })

      }
    }
    fetchBlackListData()
     
  },[dispatch]);


  return (
    <div className="list">
      <h1>Black liste</h1>
      <table>
        <thead>
          <tr>
            <th>Nom de l'etablissement</th>
            <th>Numero de l'etablissement</th>
            <th>Adresse de l'etablissement</th>

          </tr>
        </thead>


      </table>
          {etablissements && etablissements?.map(blacklist => (
            <BlackListDetails key={blacklist.id} blacklist={blacklist} />
          ))}
    </div>
  );
};

export default BlackList;
