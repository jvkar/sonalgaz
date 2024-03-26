import React, { useEffect } from "react";
import BlackListDetails from "../components/BlackListDetails";
import { useEtablissementContext } from "../hooks/useEtablissementContext";

const BlackList = ({ etablissement }) => {
  const [blackList,setBlackList]=React.useState([])
  useEffect (()=>{
    const fetchBlackListData=async()=>{
      const response = await fetch('/api/Etablissements/getBL')
      const json=await response.json();
      if(response.ok){
        setBlackList(json);
      }
    }
    fetchBlackListData()
     
  },[blackList]);


  return (
    <div className="BlackList">
      <h1>Black liste</h1>
      <table>
        <thead>
          <tr>
            <th>Nom de l'etablissement</th>
            <th>Numero de l'etablissement</th>
            <th>Adresse de l'etablissement</th>
            <th>Ajouter A la liste blanche</th>
          </tr>
        </thead>


      </table>
          {blackList && blackList?.map(etablissement => (
            <BlackListDetails key={etablissement.id} blackList={etablissement} />
          ))}
    </div>
  );
};

export default BlackList;
