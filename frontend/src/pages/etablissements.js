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
const Etablissement = ({ etablissement }) => {
  const { user } = useAuthContext()
  const userType = user.userType
  const { etablissements, dispatch } = useEtablissementContext()
  const [error, setError] = useState(undefined)
  const [isLoading,setIsLoading] = useState(true)
  const handleDelete = async () => {
    if (!user) {
      setError("you must be logged in")
      return
    }
    const response = await fetch('/api/Etablissements/delAll', {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${user.token}` }
    })
    const json = response.json()
    if (!response.ok) {
      setError(json.error)
    }
    if (response.ok) {
      dispatch({ type: 'DELETE_ETABLISSEMENT', payload: json })

    }
    window.location.reload();
  }
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
          <Button onClick={handleDelete} style={{ marginRight: "15px" }} className="DeleteAll" variant="outlined" startIcon={<MdDelete />}>Delete ALL</Button>
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