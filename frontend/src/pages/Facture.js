import { useEffect } from "react"
import FactureDetails from "../components/FactureDetails"
import { useFactureContext } from "../hooks/useFactureContext"
import FactureForme from "../components/FactureForme";

const Facture =()=>{
  const { factures, dispatch } = useFactureContext()

  

useEffect(() => {
const fetchFactures = async () => {
  const response = await fetch('/api/Factures')
  const json = await response.json()

  if (response.ok) {
    dispatch({type: 'SET_FACTURE', payload: json})

  }
}

fetchFactures()
}, [dispatch])
    return (

      <div className="factures">
        <div>
        <h1>La liste des Factures</h1>
        <table>
        <tr>
          <th>Numero de Facture</th>
          <th>Numero de Client</th>

        </tr>
        </table>
        {factures && factures.map(facture => (
          <FactureDetails key={facture._id} facture={facture}/>
        ))}</div>
                <div>
            <FactureForme/>
        </div>
      </div>

    );
}
export default Facture;