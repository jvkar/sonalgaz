import { createContext, useReducer } from 'react'

export const ClientContext = createContext()

export const clientReducer = (state, action) => {
  switch (action.type) {
    case 'SET_COUPURE_CLIENTS':
      return { ...state, clients: { ...state.clients, coupures: action.payload } };
    case 'SET_RETABLISSEMENT_CLIENTS':
      return { ...state, clients: { ...state.clients, retablissements: action.payload } };
    case 'CREATE_CLIENT':
      return { 
        clients: [action.payload, ...state.clients] 
      }
      case 'DELETE_CLIENTS':
        return { 
          clients: state.clients.filter(c => c._id !== action.payload._id) 
        }
    default:
      return state
  }
}

export const CLientContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(clientReducer, { 
    clients: null
  })
  
  return (
    <ClientContext.Provider value={{ ...state, dispatch }}>
      { children }
    </ClientContext.Provider>
  )
}