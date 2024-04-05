import { useContext } from "react"
import { TechnicienContext } from "../context/technicienContext"
export const useTechnicienContext = () => {
  const context = useContext(TechnicienContext)

  if(!context) {
    throw Error('useTechnicienContext must be used inside an TechnicienContextProvider')
  }

  return context
}