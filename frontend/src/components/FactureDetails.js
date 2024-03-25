import React,{useEffect} from 'react';


const FactureDetails = ({ facture }) => {


  const [client,setClient]=React.useState([]);

  useEffect (()=>{
    const fetchClientData=async()=>{
      const response = await fetch(`/api/Clients/ByFacture/${facture.NumeroClient}`)
      const json=await response.json();
      if(response.ok){
        setClient(json);
      }
    }
    fetchClientData()
  },[client[0]]);

  return (
    <div>

      <table>
  
        <tr>
          <td>{facture.Numero}</td>
          <td>{client[0]?.NumClient}</td>

       </tr>
       
          </table>

          </div>
          
  );
};

export default FactureDetails;
