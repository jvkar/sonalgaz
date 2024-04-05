import { createContext, useReducer } from 'react'

export const TechnicienContext = createContext()

export const technicienReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TECHNICIENS':
      return{
      techniciens: action.payload
      }

    case 'CREATE_TECHNICIENS':
      return { 
        ...state,
        techniciens: [action.payload, ...state.techniciens] 
      }
      case 'DELETE_TECHNICIENS':
        return { 
          ...state,
          techniciens: state.techniciens.filter(t => t._id !== action.payload._id) 
        }
    default:
      return state
  }
}

export const TechnicienContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(technicienReducer, { 
    techniciens: null
  })
  
  return (
    <TechnicienContext.Provider value={{ ...state, dispatch }}>
      { children }
    </TechnicienContext.Provider>
  )
}