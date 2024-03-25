import { FactureContext } from "../context/factureContext"
import { useContext } from "react"

export const useFactureContext = () => {
  const context = useContext(FactureContext)

  if(!context) {
    throw Error('useFactureContext must be used inside an FactureContextProvider')
  }

  return context
}