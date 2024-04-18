import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useParams } from "react-router-dom";
import CoupureCard from "./cards/coupureCard";
import RetablissementCard from "./cards/retablissementCard";
import ClientCard from "./cards/clientsCard";
import EntrepriseCard from "./cards/entrepriseCard";
import { PieChart } from '@mui/x-charts/PieChart';
const Dashboard = () => {
  const { user } = useAuthContext();
  const userName = user.nom
  const userType= user.userType
  const [coupureLength, setCoupureLength] = useState(null);
  const [retablissementLength, setRetablissementLength] = useState(null);
  const [entrepriseLength, setEntrepriseLength] = useState(null);
  const [clientLength, setClientLength] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await fetch(
          `/api/Clients/clientsLengthPerAgence/${id}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        const json = await response.json();
        setClientLength(json);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchClientData();
  }, [id, user.token]);
  useEffect(() => {
    const fetchCoupureLengthData = async () => {
      try {
        const response = await fetch(
          `/api/Clients/coupureLengthPerAgence/${id}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch data");
        }
        const jsonData = await response.json();
        setCoupureLength(jsonData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchCoupureLengthData();
  }, [id, user.token]);
  useEffect(() => {
    const fetchRetablissementLengthData = async () => {
      try {
        const response = await fetch(
          `/api/Clients/retablissementLengthPerAgence/${id}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch data");
        }
        const jsonData = await response.json();
        setRetablissementLength(jsonData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchRetablissementLengthData();
  }, [id, user.token]);

  useEffect(() => {
    const fetchEntrepriseLengthData = async () => {
      try {
        const response = await fetch(
          `/api/Etablissements/lengthEtablissementsPerAgence/${id}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch data");
        }
        const jsonData = await response.json();
        setEntrepriseLength(jsonData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchEntrepriseLengthData();
  }, [id, user.token]);

  return (
    <React.Fragment>
    {error && <div className="error">{error}</div>}
      {userType==="CadreAgence"? (
        <>
        <h1>Bienvenue au portail d'agence de {userName}</h1>
      <div style={{ display: "flex", flexDirection: "row" }}>

        <CoupureCard coupure={coupureLength} />
        <RetablissementCard retablissement={retablissementLength} />
        <EntrepriseCard entreprise={entrepriseLength} />
        <ClientCard client={clientLength}/>
      </div>
      </>
      ):(userType==="responsableEntreprise"?(
        <>
        <h1>Bienvenue au portail d' {userName}</h1>
        <div style={{ display: "flex", flexDirection: "row" }}>

        <CoupureCard coupure={coupureLength} />
        <RetablissementCard retablissement={retablissementLength} />
        <EntrepriseCard entreprise={entrepriseLength} />
        <ClientCard client={clientLength}/>
      </div>
      </>
      ):(<></>))}

    </React.Fragment>
  );
};

export default Dashboard;