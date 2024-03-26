import React, { useEffect } from "react";
import CoupureDetails from "../components/CoupureDetails";
import RetablissementDetails from "../components/RetablissementDetails";
import { useClientContext } from "../hooks/useClientContext";
import ClientForme from "../components/ClientForm";
import { useParams } from 'react-router-dom';

const Client = () => {
  const { clients, dispatch } = useClientContext();
  const { id } = useParams()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const coupureResponse = await fetch(`/api/Clients/coupures/${id}`);
        const retablissementResponse = await fetch(`/api/Clients/retablissements/${id}`);

        if (coupureResponse.ok && retablissementResponse.ok) {
          const coupureJson = await coupureResponse.json();
          const retablissementJson = await retablissementResponse.json();

          dispatch({ type: 'SET_COUPURE_CLIENTS', payload: coupureJson });
          dispatch({ type: 'SET_RETABLISSEMENT_CLIENTS', payload: retablissementJson });
        } else {
          console.error('Error fetching data:', coupureResponse.statusText, retablissementResponse.statusText);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <div className="list">
      <div>

          <h1>la liste des coupures</h1>
        <table>
          <thead>

              <th>Code Client</th>
              <th>Reference Client</th>
              <th>Nom Client</th>
              <th>Adresse Client</th>
              <th>Numero du Compteur de Client</th>
              <th>Type de Client</th>
              <th>Etat</th>

          </thead>


            {clients?.coupures && clients.coupures.map(client => (
              <CoupureDetails key={client._id} client={client} />
            ))}


        </table>
          <h1>la liste des retablissements</h1>
        <table>
          <thead>

              <th>Code Client</th>
              <th>Reference Client</th>
              <th>Nom Client</th>
              <th>Adresse Client</th>
              <th>Numero du Compteur de Client</th>
              <th>Type de Client</th>
              <th>Etat</th>

          </thead>
          
            {clients?.retablissements && clients.retablissements.map(client => (
              <RetablissementDetails key={client._id} client={client} />
            ))}
    
        </table>
      </div>
      <div>
        <ClientForme/>
      </div>
    </div>
  );
}

export default Client;
