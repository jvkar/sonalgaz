import { useEffect ,useState} from "react"
import AgenceDetails from "../components/AgenceDetails"
import { useAgenceContext } from "../hooks/useAgenceContext"
import { useAuthContext } from '../hooks/useAuthContext'
import Button from "@mui/material/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { MdDelete } from "react-icons/md";
import { LuPencilLine } from "react-icons/lu";
import AddButtonAgance from "../components/buttons/addBtnAgence";

import ModelAdd from "../components/models/modelAdd";
const Agences = () => {
  const [ error, setError] = useState('')
  const { agences, dispatch } = useAgenceContext()
  const { user } = useAuthContext()
  const handleDelete=async()=>{
    if (!user) {
      setError('You must be logged in')
      return
    }

    const response=await fetch('/api/Agences/deleteAll',{
      method:'DELETE',
      headers:{'Authorization': `Bearer ${user.token}`}
    })
    const json =response.json()
    if(!response.ok){
      setError(json.error)
    }
    if(response.ok){
      dispatch({type:'DELETE_AGENCE',payload:json})

    }
    window.location.reload();
  }


  useEffect(() => {
    const fetchAgences = async () => {
      const response = await fetch('/api/Agences', {
        headers: { 'Authorization': `Bearer ${user.token}` },
      })
      const json = await response.json()

      if (response.ok) {
        dispatch({ type: 'SET_AGENCE', payload: json })

      }
    }
    if (user && user.userType == "admin") {
      fetchAgences()
    }
  }, [dispatch, user])
  return (
    <div className="list">
      <div className='Title'>
        <h1>La Liste des Agences</h1>
        <div className='AddBtt'>
          {/* <Button onClick={handleDelete} style={{ marginRight: "15px" }} className="DeleteAll" variant="outlined" startIcon={<MdDelete />}>Delete ALL</Button>           */}

          <ModelAdd/>
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align="center">Numéro de l'Agence</TableCell>
              <TableCell align="center">Nom de l'agence</TableCell>
              <TableCell align="center">Adresse De l'agence</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {agences && agences.map(agence => (
              <AgenceDetails key={agence._id} agence={agence} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </div>
  );
}

export default Agences;