import { AgenceContext } from "../context/agenceContext"
import { useContext } from "react"

export const useAgenceContext = () => {
  const context = useContext(AgenceContext)

  if(!context) {
    throw Error('useClientContext must be used inside an ClientContextProvider')
  }

  return context
}