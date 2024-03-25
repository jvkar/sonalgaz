import { createContext, useReducer } from 'react'

export const AgenceContext = createContext()

export const agenceReducer = (state, action) => {
  switch (action.type) {
    case 'SET_AGENCE':
      return {
        agences: action.payload
      }
    case 'CREATE_AGENCE':
      return {
        agences: [action.payload, ...state.agences]
      }
    case 'DELETE_AGENCE':
      return {
        agences: state.agences.filter(a => a._id !== action.payload._id)
      }
    default:
      return state
  }
}

export const AgenceContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(agenceReducer, {
    agences: null
  })

  return (
    <AgenceContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AgenceContext.Provider>
  )
}