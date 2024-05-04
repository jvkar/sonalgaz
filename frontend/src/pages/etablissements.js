import { useEffect, useState } from "react"
import EtablissementDetails from "../components/EtablissementDetail"
import { useEtablissementContext } from "../hooks/useEtablissementContext"
import { useAuthContext } from "../hooks/useAuthContext";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { MdDelete } from "react-icons/md";
import { LuPencilLine } from "react-icons/lu";
import CircularProgress from "@mui/material/CircularProgress";
import ModelAddEntreprise from "../components/models/modelAddEntreprise";
import ArchiveIcon from '@mui/icons-material/Archive';
import ModelArchiveEntrep from "../components/models/modelArchiveEntrep";
const Etablissement = ({ etablissement }) => {
  const { user } = useAuthContext()
  const userType = user.userType
  const { etablissements, dispatch } = useEtablissementContext()
  const [error, setError] = useState(undefined)
  const [isLoading,setIsLoading] = useState(true)
 
  useEffect(() => {
    const fetchEtablissement = async () => {
      const response = await fetch('/api/Etablissements/', {
        headers: { 'Authorization': `Bearer ${user.token}` },
      })
      const json = await response.json()

      if (response.ok) {
        dispatch({ type: 'SET_ETABLISSEMENT', payload: json })
        setIsLoading(false)

      }
    }
    if (user && user.userType == "admin") {
      fetchEtablissement()
    }
  }, [dispatch, user])

  return (
    <div className="list">
      <div className='Title'>
        <h1>La Liste des Entreprises </h1>
        <div className='AddBtt'>
          <ModelArchiveEntrep/>
          <ModelAddEntreprise />
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table >
          <TableRow>
            <TableCell align="center">Numéro de l'entreprise</TableCell>
            <TableCell align="center">Nom de l'entreprise</TableCell>
            <TableCell align="center">Adresse De l'entreprise</TableCell>
           {userType == "CadreAgence" ? <TableCell align="center">Nombre de fois dans la liste noire</TableCell>:<></>} 
            <TableCell align="center">nombre de coupure/annee</TableCell>
            <TableCell align="center">nombre de retablissements/annee</TableCell>
            <TableCell align="center"></TableCell>
            <TableCell align="center"></TableCell>
            <TableCell style={{ fontWeight: "bold" }} align="center"></TableCell>
          </TableRow>
          <TableBody>

          {isLoading == true ? (<TableRow style={{display:"flex",justifyContent:"center",alignItems:"center",width:"100%"}}>    <CircularProgress style={{margin:"15px"}}/>          </TableRow>) :( 
            etablissements && etablissements.map(etablissement => (
              <EtablissementDetails key={etablissement._id} etablissement={etablissement} />
            ))
          )}
          </TableBody>
        </Table>
      </TableContainer>


    </div>
  );
}
export default Etablissement;