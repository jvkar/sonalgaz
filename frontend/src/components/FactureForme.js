import { useState } from 'react'
import { useFactureContext } from '../hooks/useFactureContext'

const FactureForme = () => {
  const { dispatch } = useFactureContext()

  const [file, setfile] = useState(undefined)
  const [error, setError] = useState(null)


  const handleSubmit = async (e) => {
    e.preventDefault()


    const facture = {file}
    if(file === null || file === undefined ){
      console.log("Veuillez choisir une image");
    }else{
      const formData = new FormData();
      formData.append("file", file);

    
    const response = await fetch('/api/Factures/add', {
      method: 'POST',
      body: formData,
    
      headers: {
        // 'Content-Type': 'application/json'
      }
    })
    const json = await response.json()

    if (!response.ok) {
      setError(json.error)
    }
    if (response.ok) {
      setError(null)
      // setNumero('');
      // setNumeroClient('');
      setfile(undefined)
      dispatch({type: 'CREATE_FACTURE', payload: json})



    }
    }

  }

  return (
    <form className="form" onSubmit={handleSubmit}> 
      <h3>Ajouter la liste des factures ( format csv )</h3>
{/* 
      <label>Numero de la facture:</label>
      <input 
        type="Number" 
        onChange={(e) => setNumero(e.target.value)} 
        value={Numero}
      />
          
      <label>Numero de client:</label>
      <input 
        type="Number" 
        onChange={(e) => setNumeroClient(e.target.value)} 
        value={NumeroClient}
      /> */}
                 <input type="file" onChange={(e) => setfile(e.target.files[0])} />
          

   

      <button type="submit">Ajouter la liste</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default FactureForme