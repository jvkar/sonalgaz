import { useEffect, useState } from "react"
import EtablissementDetails from "../components/EtablissementDetail"
import { useEtablissementContext } from "../hooks/useEtablissementContext"
import { useAuthContext } from "../hooks/useAuthContext";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useParams } from 'react-router-dom';


const EtabAgence = ({etablissement}) => {
    const { user } = useAuthContext()
    const { etablissements, dispatch } = useEtablissementContext()
    const [error, setError] = useState(undefined)
    const { id } = useParams()
    useEffect(() => {
        const fetchEtablissement = async () => {
          const response = await fetch(`/api/Etablissements/etablissement/${id}`, {
            headers: { 'Authorization': `Bearer ${user.token}` },
          })
          const json = await response.json()
    
          if (response.ok) {
            dispatch({ type: 'SET_ETABLISSEMENT', payload: json })
    
          }
        }
        if (user && user.userType == "CadreAgence") {
            fetchEtablissement()
        }
      }, [dispatch, user])
      return (
        <div className="list">

          <div className='Title'>
            <h1>La Liste des Entreprise</h1>

          </div>
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center">Numéro de l'entreprise</TableCell>
                  <TableCell align="center">Nom de l'entreprise</TableCell>
                  <TableCell align="center">Adresse De l'entreprise</TableCell>
                  <TableCell align="center">Nombre de fois dans la liste noire</TableCell>
                  <TableCell align="center">nombre de coupure/annee</TableCell>
                  <TableCell align="center">nombre de retablissements/annee</TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {etablissements && etablissements.map(etablissement => (
              <EtablissementDetails key={etablissement._id} etablissement={etablissement} />
            ))}
              </TableBody>
            </Table>
          </TableContainer>
    
        </div>

    );
}
 
export default EtabAgence;