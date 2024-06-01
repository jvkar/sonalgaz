import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { useParams } from 'react-router-dom';
export const useCreateAccount = () => {
  const {user}=useAuthContext();
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const {id} = useParams()

  const agenceCreateAccount = async (nomCadre,numeroAgence,username, password,headers) => {
    if(!user){
      setError('you must be logged in')
      return
    }
    setIsLoading(true)
    setError(null)

    const response = await fetch('/api/Agences/createuser', {
      method: 'POST',
      headers: {'Content-Type': 'application/json',
      ...headers
    },
      body: JSON.stringify({ nomCadre,numeroAgence,username, password })
    })
    const json = await response.json()

    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
    }
    if (response.ok) {
      setIsLoading(false)
    }
  }
  const etabCreateAccount = async (nomResponsable,NumeroEtablissement,username, password,headers) => {
    setIsLoading(true)
    setError(null)

    const response = await fetch('/api/Etablissements/createuser', {
      method: 'POST',
      headers: {'Content-Type': 'application/json' ,...headers},
      body: JSON.stringify({ nomResponsable,NumeroEtablissement,username, password })
    })
    const json = await response.json()

    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
    }
    if (response.ok) {


      setIsLoading(false)
    }
  }
  const technicienCreateAccount = async (nomTechnicien,codeTechnicien,nbrInterventions,username, password,headers) => {
    if(!user){
      setError('you must be logged in')
      return
    }
    setIsLoading(true)
    setError(null)

    const response = await fetch(`/api/Techniciens/createuser/${id}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', ...headers
    },
      body: JSON.stringify({ nomTechnicien,codeTechnicien,nbrInterventions,username, password })
    })
    const json = await response.json()

    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
    }
    if (response.ok) {
      setIsLoading(false)
    }
  }
  return { technicienCreateAccount,etabCreateAccount,agenceCreateAccount, isLoading, error }
}