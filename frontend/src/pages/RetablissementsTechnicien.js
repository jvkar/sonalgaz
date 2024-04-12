import React, { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useParams } from 'react-router-dom';
import RetabCard from "../components/RetabCard"; 
const RetablissementTech = () => {
  const { user } = useAuthContext();
  const Nom = user?.nom;
  const { id } = useParams();
  const [assignedCoupure, setassignedCoupure] = useState([]);
  const [assignedRetab, setassignedRetab] = useState([]);

  useEffect(() => {
    const fetchRetabData = async () => {
      const response = await fetch(`/api/Techniciens/retabPerEtab/${id}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (response.ok) {
        const json = await response.json();
        setassignedRetab(json);
      }
    };
    if (user) {
      fetchRetabData();
    }
  }, [id, user]);



  return (
    <div className="list">
      <React.Fragment>
        <div className='Title' style={{ marginBottom: "20px" }}>
          <h1>la liste des retablissement de {Nom}</h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {assignedRetab && assignedRetab.map((retablissement, index) => (
            <RetabCard key={index} retablissement={retablissement} />
          ))}
        </div>


      </React.Fragment>
    </div>
  );
}

export default RetablissementTech;
