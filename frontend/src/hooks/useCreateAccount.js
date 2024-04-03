import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { useParams } from 'react-router-dom';
export const useCreateAccount = () => {
  const {user}=useAuthContext();
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()
  const {id} = useParams()

  const agenceCreateAccount = async (numeroAgence,username, password,headers) => {
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
      body: JSON.stringify({ numeroAgence,username, password })
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
  const etabCreateAccount = async (NumeroEtablissement,username, password,headers) => {
    setIsLoading(true)
    setError(null)

    const response = await fetch('/api/Etablissements/createuser', {
      method: 'POST',
      headers: {'Content-Type': 'application/json' ,...headers},
      body: JSON.stringify({ NumeroEtablissement,username, password })
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
  const technicienCreateAccount = async (nomTechnicien,codeTechnicien,username, password,headers) => {
    if(!user){
      setError('you must be logged in')
      return
    }
    setIsLoading(true)
    setError(null)

    const response = await fetch(`/api/Techniciens/createuser/${id}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json',
      ...headers
    },
      body: JSON.stringify({ nomTechnicien,codeTechnicien,username, password })
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