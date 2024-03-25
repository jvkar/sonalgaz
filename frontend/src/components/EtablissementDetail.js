import { useState, useEffect } from 'react';
import { useEtablissementContext } from '../hooks/useEtablissementContext';
import { useAuthContext } from '../hooks/useAuthContext';
import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import TableHead from "@mui/material/TableHead";

import '../index.css'
import Paper from "@mui/material/Paper";
import { Button } from '@mui/material';
import { LuPencilLine } from "react-icons/lu";
import { Margin } from '@mui/icons-material';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
const EtablissementDetails = ({ etablissement }) => {
  const { user } = useAuthContext()
  const userType = user.userType
  const [assignedCoupure, setassignedCoupure] = React.useState([])
  const [assignedRetab, setassignedRetab] = React.useState([])
  const [error, setError] = useState(undefined)
  const [open, setOpen] = React.useState(false);
  const affecterCoupure = async()=>{
    const response = await fetch(`/api/Clients/affecterCoupure/${etablissement._id}`,{
      method:'PATCH'
    })
    const json =await response.json();
    if(response.ok){
     alert("coupure affecter")
    }
    if(!response.ok){
      setError(json.error);
      setTimeout(()=>{
        setError("")
      },3000)
    }
  }
  const affecterRetablissement = async()=>{
    const response = await fetch(`/api/Clients/affecterRetab/${etablissement._id}`,{
      method:'PATCH'
    })
    const json = await response.json();
    if(response.ok){
      alert("retablissement affecter")
    }
    if(!response.ok){
      setError(json.error);
      setTimeout(()=>{
        setError("")
      },3000)
        }
  }
  const blackList = async()=>{

  }
  const handleUpdate = async () => {
    if (!user) {
      setError('You must be logged in')
      return
    }

    window.location.href = `/UpdateFormEtablissement/${etablissement._id}`;

  }
  useEffect(() => {
    const fetchCoupureData = async () => {
      const response = await fetch(`/api/Clients/coupurePerEtab/${etablissement._id}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      })
      const json = await response.json();
      if (response.ok) {
        setassignedCoupure(json);
      }
    }
    if (user) {
      fetchCoupureData()
    }
  }, [assignedCoupure[0], user]);
  useEffect(() => {
    const fetchRetabData = async () => {
      const response = await fetch(`/api/Clients/retabPerEtab/${etablissement._id}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      })
      const json = await response.json();
      if (response.ok) {
        setassignedRetab(json);
      }
    }
    if (user) {
      fetchRetabData()
    }
  }, [assignedRetab[0], user]);

  const { dispatch } = useEtablissementContext()

  const handleClick = async () => {
    if (!user) {
      return
    }
    const response = await fetch(`api/Etablissements/del/${etablissement._id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${user.token}` }
    });
    const json = await response.json();
    if (response.ok) {
      dispatch({ type: 'DELETE_ETABLISSEMENT', payload: json })
    }
    window.location.reload()

  }


  const icon3 = (<button onClick={handleUpdate} style={{ marginRight: "25px", backgroundColor: "transparent", borderColor: "transparent", cursor: "pointer" }}><LuPencilLine style={{ width: "24px", height: "24px" }} /></button>);

  const icon5 = (<button onClick={handleClick} style={{ backgroundColor: "transparent", borderColor: "transparent", cursor: "pointer" }}><img width="24px" height="24px" src="https://img.icons8.com/material-rounded/24/filled-trash.png" alt="filled-trash" />
  </button>);

  return (
    <React.Fragment>
      {error && <div className="error">{error}</div>}

            <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
      {userType === 'CadreAgence'?
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        :
        <></> 
        }
        <TableCell align="center">{etablissement?.NumeroEtablissement}</TableCell>
        <TableCell align="center">{etablissement?.Nom} </TableCell>
        <TableCell align="center">{etablissement?.Adresse}</TableCell>
        <TableCell align="center"></TableCell>
        <TableCell align="center"></TableCell>
        <TableCell align="center"></TableCell>

        {userType === 'CadreAgence' ?
        <TableCell align='center' ><div style={{ paddingRight: "10px" }}>
        <Button style={{ margin: "2px" }} onClick={affecterCoupure} variant="contained"> affecter coupure </Button>
        <Button style={{ margin: "2px" }} onClick={affecterRetablissement}  variant="contained"> affecter retablissement </Button>
        <Button style={{ margin: "2px" }} onClick={blackList} variant="contained"> Black List </Button>
        </div></TableCell>
        :
        <TableCell align='center' ><div style={{ paddingRight: "10px" }}>{icon3}{icon5}</div></TableCell>
        }          
          
      </TableRow>
      {userType==="CadreAgence" ?
      <TableRow>
      <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0, backgroundColor: "#eeeeee" }} colSpan={6}>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{ margin: 1 }}>
            <Typography variant="h6" gutterBottom component="div">
              les coupures de {etablissement?.Nom}
            </Typography>
            <Table size="small" aria-label="purchases">
              <TableHead>
                <TableRow>
                  <TableCell align="center" >code </TableCell>
                  <TableCell align="center">Nom</TableCell>
                  <TableCell align="center">Adresse </TableCell>
                </TableRow>
              </TableHead>
              <TableBody className='entreprise'>
                {assignedCoupure[0]?.clients && assignedCoupure[0]?.clients?.map((coupure,index) => (
                  <TableRow key={index}>
                    <TableCell align="center" component="th" scope="row">
                      {coupure.codeClient}
                    </TableCell>
                    <TableCell align="center">{coupure.nomClient}</TableCell>
                    <TableCell align="center">
                      {coupure.adresseClient}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
    <TableRow>
    <TableCell style={{ paddingBottom: 0, paddingTop: 0, backgroundColor: "#eeeeee" }} colSpan={6}>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box sx={{ margin: 1 }}>
          <Typography variant="h6" gutterBottom component="div">
            les retablissement de {etablissement?.Nom}
          </Typography>
          <Table size="small" aria-label="purchases">
            <TableHead>
              <TableRow>
                <TableCell align="center" >code </TableCell>
                <TableCell align="center">Nom</TableCell>
                <TableCell align="center">Adresse </TableCell>
              </TableRow>
            </TableHead>
            <TableBody className='entreprise'>
              {assignedRetab[0]?.clients && assignedRetab[0]?.clients?.map((retablissement,index) => (
                <TableRow key={index}>
                  <TableCell align="center" component="th" scope="row">
                    {retablissement.codeClient}
                  </TableCell>
                  <TableCell align="center">{retablissement.nomClient}</TableCell>
                  <TableCell align="center">
                    {retablissement.adresseClient}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Collapse>
    </TableCell>
  </TableRow>
  </TableRow>
    :<></>
       }
    </React.Fragment>

  )
}
export default EtablissementDetails;
