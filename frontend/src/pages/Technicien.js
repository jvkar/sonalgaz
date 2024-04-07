import { useEffect, useState } from "react"
import TechnicienDetails from "../components/TechnicienDetails";
import { useTechnicienContext } from "../hooks/useTechnicienContext";
import { useAuthContext } from "../hooks/useAuthContext";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import { useParams } from 'react-router-dom';


const Technicien = ({technicien}) => {
    const { user } = useAuthContext()
    const [technicienD,setTechnicien] = useState([])
    const [isLoading , setIsLoading] = useState(true)
    const { techniciens, dispatch } = useTechnicienContext()
    const [error, setError] = useState(undefined)
    const { id } = useParams()
    useEffect(() => {
        const fetchTechniciens = async () => {
          const response = await fetch(`/api/Techniciens/getTechniciens/${id}`, {
            headers: { 'Authorization': `Bearer ${user.token}` },
          })
          const json = await response.json()
    
          if (response.ok) {
            dispatch({ type: 'SET_TECHNICIENS', payload: json })
            setTechnicien(json)
            setIsLoading(false)
          }
          if(!response.ok){
            setError(json.error)
          }
        }
        if (user && user.userType == "responsableEntreprise") {
          fetchTechniciens()
        }
      }, [dispatch, user])
      return (
        <div className="list">
          {error && <div className="error"> {error} </div>}
          <div className='Title'>
            <h1>La Liste des Techniciens</h1>

          </div>
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                <TableCell align="center"></TableCell>

                  <TableCell align="center" >Code Technicien</TableCell>
                  <TableCell  align="center">Nom de Technicien</TableCell>
                  <TableCell align="center">Username Technicien</TableCell>

                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {isLoading == true ? (<TableRow style={{display:"flex",justifyContent:"center",alignItems:"center",width:"100%"}}>    <CircularProgress style={{margin:"15px"}}/>          </TableRow>) :( 
              techniciens && techniciens.map(technicien => (
              <TechnicienDetails key={technicien._id} technicien={technicien} />
            ))
          )}
              </TableBody>
            </Table>
          </TableContainer>
    
        </div>

    );
}
 
export default Technicien;