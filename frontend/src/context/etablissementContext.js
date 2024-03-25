import { createContext, useReducer } from 'react'

export const EtablissementContext = createContext()

export const etablissementReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ETABLISSEMENT':
      return {
        etablissements: action.payload
      }
    case 'CREATE_ETABLISSEMENT':
      return {
        etablissements: [action.payload, ...state.etablissements]
      }
    case 'DELETE_ETABLISSEMENT':
      return {
        etablissements: state.etablissements.filter(e => e._id !== action.payload._id)
      }
    default:
      return state
  }
}

export const EtablissementContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(etablissementReducer, {
    etablissements: null
  })

  return (
    <EtablissementContext.Provider value={{ ...state, dispatch }}>
      {children}
    </EtablissementContext.Provider>
  )
}