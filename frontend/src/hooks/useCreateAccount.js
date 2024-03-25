import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useCreateAccount = () => {
  const {user}=useAuthContext();
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()

  const agenceCreateAccount = async (numeroAgence,username, password) => {
    if(!user){
      setError('you must be logged in')
      return
    }
    setIsLoading(true)
    setError(null)

    const response = await fetch('/api/Agences/createuser', {
      method: 'POST',
      headers: {'Content-Type': 'application/json',

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
  const etabCreateAccount = async (NumeroEtablissement,username, password) => {
    setIsLoading(true)
    setError(null)

    const response = await fetch('/api/Etablissements/createuser', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
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
  return { etabCreateAccount,agenceCreateAccount, isLoading, error }
}