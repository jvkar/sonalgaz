import { createContext, useReducer } from 'react'

export const FactureContext = createContext()

export const factureReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FACTURE':
      return { 
        factures: action.payload 
      }
    case 'CREATE_FACTURE':
      return { 
        factures: [action.payload, ...state.factures] 
      }
    default:
      return state
  }
}

export const FactureContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(factureReducer, { 
    factures: null
  })
  
  return (
    <FactureContext.Provider value={{ ...state, dispatch }}>
      { children }
    </FactureContext.Provider>
  )
}