import { ClientContext } from "../context/clientContext"
import { useContext } from "react"

export const useClientContext = () => {
  const context = useContext(ClientContext)

  if(!context) {
    throw Error('useClientContext must be used inside an ClientContextProvider')
  }

  return context
}