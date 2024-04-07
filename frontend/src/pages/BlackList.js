import React, { useEffect ,useState} from "react";
import BlackListDetails from "../components/BlackListDetails";
import { useEtablissementContext } from "../hooks/useEtablissementContext";
import { useAuthContext } from "../hooks/useAuthContext";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import { useParams } from "react-router-dom";
const BlackList = ({ etablissement }) => {

  const {user}= useAuthContext()
  const {etablissements,dispatch} = useEtablissementContext()
  const [isLoading , setIsLoading] = useState(true)
  const [blackList,setBlackList] = useState(etablissement)
  const {id} = useParams()
  useEffect (()=>{
    const fetchBlackListData=async()=>{
      const response = await fetch(`/api/Etablissements/getBL/${id}`, {
        headers: { 'Authorization': `Bearer ${user.token}` },
      })
      const json=await response.json();
      if(response.ok){

        dispatch({ type: 'SET_ETABLISSEMENT', payload: json })
        setBlackList(json)
        setIsLoading(false)
      }
    }
    if(user && user.userType == "CadreAgence"){


        fetchBlackListData()

    }
     
  },[dispatch]);


  return (
    <div className="list">
      <div>
      <h1>La liste noire</h1>
      </div>
      <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>

                  <TableCell align="center">Numéro de l'entreprise</TableCell>
                  <TableCell align="center">Nom de l'entreprise</TableCell>
                  <TableCell align="center">Adresse De l'entreprise</TableCell>

                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {isLoading == true ? (<TableRow style={{display:"flex",justifyContent:"center",alignItems:"center",width:"100%"}}>    <CircularProgress style={{margin:"15px"}}/>          </TableRow>) :( 
              etablissements && etablissements?.map(blacklist => (
            <BlackListDetails key={blacklist.id} blacklist={blacklist} />
          ))
        )}

              </TableBody>
            </Table>
          </TableContainer>


    </div>
  );
};

export default BlackList;
