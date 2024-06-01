import React, { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useParams } from 'react-router-dom';
import CoupCard from "../components/CoupCard";
const CoupureTech = () => {
  const { user } = useAuthContext();
  const Nom = user?.nom;
  const { id } = useParams();
  const [assignedCoupure, setassignedCoupure] = useState([]);

  useEffect(() => {
    const fetchCoupureData = async () => {
      const response = await fetch(`/api/Techniciens/coupurePerEtab/${id}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (response.ok) {
        const json = await response.json();
        setassignedCoupure(json);
      }
    };
    if (user) {
      fetchCoupureData();
    }
  }, [id, user]);



  return (
    <div className="list">
      <React.Fragment>
        <div className='Title' style={{ marginBottom: "20px" }}>
          <h1>la liste des coupures de {Nom}</h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {assignedCoupure && assignedCoupure.map((coupure, index) => (
            <CoupCard key={index} coupure={coupure} />
          ))}
        </div>


      </React.Fragment>
    </div>
  );
}

export default CoupureTech;
