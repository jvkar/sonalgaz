import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useParams } from "react-router-dom";
import CoupureCard from "./cards/coupureCard";
import RetablissementCard from "./cards/retablissementCard";
import ClientCard from "./cards/clientsCard";
import EntrepriseCard from "./cards/entrepriseCard";
import Notification from "./Notification";
import Button from "@mui/joy/Button";

const Dashboard = () => {
  const { user } = useAuthContext();
  const userName = user.nom;
  const userType = user.userType;
  const [coupureLength, setCoupureLength] = useState(null);
  const [retablissementLength, setRetablissementLength] = useState(null);
  const [entrepriseLength, setEntrepriseLength] = useState(null);
  const [clientLength, setClientLength] = useState(null);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const { id } = useParams();
  const deleteAll = async() =>{
    try {
       const response = await fetch (`/api/Techniciens/${user?.technicien}/notifications`,{
        method:"DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
       })
       const json=await  response.json()
       if(response.ok){
        setNotifications([]);
       }
       if(!response.ok){
        setError(json.error)
       }
    }catch(error){
        setError(error)
    }
  }
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await fetch(
          `/api/Clients/clientsLengthPerAgence/${user.agence}`,
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

    if (userType === "CadreAgence") {
      fetchClientData();
    }
  }, [id, user.token, user.agence, userType]);

  useEffect(() => {
    const fetchCoupureLengthData = async () => {
      try {
        const response = await fetch(
          `/api/Clients/coupureLengthPerAgence/${user.agence}`,
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

    if (userType === "CadreAgence") {
      fetchCoupureLengthData();
    }
  }, [id, user.token, user.agence, userType]);

  useEffect(() => {
    const fetchRetablissementLengthData = async () => {
      try {
        const response = await fetch(
          `/api/Clients/retablissementLengthPerAgence/${user.agence}`,
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

    if (userType === "CadreAgence") {
      fetchRetablissementLengthData();
    }
  }, [id, user.token, user.agence, userType]);

  useEffect(() => {
    const fetchEntrepriseLengthData = async () => {
      try {
        const response = await fetch(
          `/api/Etablissements/lengthEtablissementsPerAgence/${user.agence}`,
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

    if (userType === "CadreAgence") {
      fetchEntrepriseLengthData();
    }
  }, [id, user.token, user.agence, userType]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `/api/Techniciens/getNotifications/${user?.technicien}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const jsonData = await response.json();
        if (Array.isArray(jsonData)) {
          setNotifications(jsonData);
        } else {
          console.error("Fetched data is not an array:", jsonData);
          setNotifications([]);
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError(err.message);
      }
    };

    if (userType === "technicien") {
      fetchNotifications();
    }
  }, [user, user.token, userType]);

  return (
    <React.Fragment>
      {error && <div className="error">{error}</div>}
      {userType === "CadreAgence" && (
        <>
          <h1 style={{ marginBottom: "10px", textAlign: "center" }}>
            Bienvenue au portail d'agence de {userName}
          </h1>
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
            <CoupureCard coupure={coupureLength} />
            <RetablissementCard retablissement={retablissementLength} />
            <EntrepriseCard entreprise={entrepriseLength} />
            <ClientCard client={clientLength} />
          </div>
        </>
      )}
      {userType === "responsableEntreprise" && (
        <>
          <h1 style={{ marginBottom: "10px", textAlign: "center" }}>
            Bienvenue au portail d'entreprise de {userName}
          </h1>
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}></div>
        </>
      )}
      {userType === "admin" && (
        <>
          <h1 style={{ marginBottom: "10px", textAlign: "center" }}>
            Bienvenue au portail d'Admin
          </h1>
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}></div>
        </>
      )}
      {userType === "technicien" && (
        <>
          <h1 style={{ marginBottom: "10px", textAlign: "center" }}>Bienvenue</h1>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>

            <h1 style={{ fontSize: "20px" }}>Notification:</h1> <br /> <Button disabled={notifications.length==0} onClick={deleteAll}>suprimmer tout</Button>
            {notifications.length==0 ? 
                (  <p style={{textAlign:"center",marginTop:"20px"}}>Pas de notification</p>)
                  : (notifications.map((notification, index) => (
              <Notification key={index} notification={notification} />
            )))
          }
          </div>
        </>
      )}
    </React.Fragment>
  );
};

export default Dashboard;
