import { useState } from 'react'
import { useClientContext } from '../hooks/useClientContext'
const ClientForme = () => {
  const { dispatch } = useClientContext()

  // const [Nom, setNom] = useState('')
  // const [Prenom, setPrenom] = useState('')
  // const [NumClient, setNumClient] = useState('')
  const [file, setFile] = useState(undefined)
  const [error, setError] = useState(null)
  const handleDelete=async()=>{
    const response=await fetch('/api/Clients/deleteAll',{
      method: 'DELETE',
      
    })
    const json = await response.json()

    if (response.ok) {
      dispatch({type: 'DELETE_CLIENT', payload: json})
    }
    window.location.reload();
  }
  const handleSubmit = async (e) => {
    e.preventDefault()

    const client = {file}
    if(file === null || file === undefined ){
      console.log("Veuillez choisir une image");
    }else{
      const formData = new FormData();
      formData.append("file", file);

    
    const response = await fetch('/api/Clients/add', {
      method: 'POST',
      body: formData,
    
      headers: {
        // 'Content-Type': 'application/json',
        // "Content-Type": "multipart/form-data"
      }
    })
    const json = await response.json()

    if (!response.ok) {
      setError(json.error)
    }
    if (response.ok) {
      setError(null)
      // setNom('')
      // setPrenom('')
      // setNumClient('')
      setFile(undefined)
      dispatch({type: 'CREATE_CLIENT', payload: json})


      
    }
  }

  }

  return (
    <form className="form" onSubmit={handleSubmit}> 
      <h3>Ajouter la liste des client ( format csv )</h3>

      {/* <label>Nom du client:</label>
      <input 
        type="text" 
        onChange={(e) => setNom(e.target.value)} 
        value={Nom}
      />
     <br/>
      <label>Prenom du Client:</label>
      <input 
        type="text" 
        onChange={(e) => setPrenom(e.target.value)} 
        value={Prenom}
      />
      
      <label>Numero de la facture du Client:</label>
      <input 
        type="Number" 
        onChange={(e) => setNumClient(e.target.value)} 
        value={NumClient}
      /> */}
           <input type="file" onChange={(e) => setFile(e.target.files[0])} 
        />



   

      <button>Ajouter la liste</button>
      <button type="submit" onClick={handleDelete}>supprimer tout les clients</button>
      
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default ClientForme