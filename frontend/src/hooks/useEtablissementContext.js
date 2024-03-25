import { EtablissementContext } from "../context/etablissementContext"
import { useContext } from "react"

export const useEtablissementContext = () => {
  const context = useContext(EtablissementContext)

  if(!context) {
    throw Error('useEtablissementContext must be used inside an EtablissementContextProvider')
  }

  return context
}