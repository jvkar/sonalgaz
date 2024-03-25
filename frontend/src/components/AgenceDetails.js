import * as React from 'react'
import { useEffect, useState } from 'react';
import { useAgenceContext } from '../hooks/useAgenceContext';
import { useAuthContext } from '../hooks/useAuthContext'
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { LuPencilLine } from "react-icons/lu";




const AgenceDetails = ({ agence }) => {


  const { user, userType } = useAuthContext()
  const [open, setOpen] = React.useState(false);
  const { dispatch } = useAgenceContext();
  const [assignedEtablissements, setassignedEtablissements] = React.useState([])
  const [error, setError] = React.useState(undefined);

  const handleUpdate = async () => {
    if (!user) {
      setError('You must be logged in')
      return
    }


    window.location.href = `/UpdateFormAgence/${agence._id}`;

  }
  const handleDelete = async () => {
    if (!user) {
      setError('You must be logged in')
      return
    }


    const response = await fetch(`/api/Agences/deleteOne/${agence._id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${user.token}` }
    })
    const json = await response.json();
    if (!response.ok) {
      setError(json.error);
    }
    if (response.ok) {
      dispatch({ type: 'DELETE_AGENCE', payload: json });
    }
  }
  const icon3 = (<button onClick={handleUpdate} style={{ marginRight: "25px", backgroundColor: "transparent", borderColor: "transparent", cursor: "pointer" }}><LuPencilLine style={{ width: "24px", height: "24px" }} /></button>);

  const icon5 = (<button onClick={handleDelete} style={{ backgroundColor: "transparent", borderColor: "transparent", cursor: "pointer" }}><img width="24px" height="24px" src="https://img.icons8.com/material-rounded/24/filled-trash.png" alt="filled-trash" />
  </button>);
  useEffect(() => {
    const fetchEtablissementsData = async () => {
      const response = await fetch(`/api/Etablissements/etablissement/${agence._id}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      })
      const json = await response.json();
      if (response.ok) {
        setassignedEtablissements(json);
      }
    }
    if (user) {
      fetchEtablissementsData()
    }
  }, [assignedEtablissements, user]);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center" component="th" scope="row">{agence?.numeroAgence} </TableCell>
        <TableCell align="center">{agence?.nom}</TableCell>
        <TableCell align="center">{agence?.adresseAgence}</TableCell>

        <TableCell align='center' ><div style={{ paddingRight: "10px" }}>{icon3}{icon5}</div></TableCell>

      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, backgroundColor: "#eeeeee" }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Entreprises de {agence?.nom}
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" >Numéro </TableCell>
                    <TableCell align="center">Nom</TableCell>
                    <TableCell align="center">Adresse </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className='entreprise'>
                  {assignedEtablissements && assignedEtablissements.map(etablissement => (
                    <TableRow key={etablissement.id}>
                      <TableCell align="center" component="th" scope="row">
                        {etablissement.NumeroEtablissement}
                      </TableCell>
                      <TableCell align="center">{etablissement.Nom}</TableCell>
                      <TableCell align="center">
                        {etablissement.Adresse}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>

  )
}
export default AgenceDetails;
