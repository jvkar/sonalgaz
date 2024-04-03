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
import UpdateBtnAgence from './buttons/updateBtnAgence';
import ModelUpdateAgence from './models/modelUpdateAgence';
import { useNavigate } from 'react-router-dom';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import { Button } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const AgenceDetails = ({ agence }) => {

  const [agenceDetails, setAgenceDetails] = useState(agence);
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
  const updateState = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`/api/Agences/stateChange/${agence._id}`, {
        method: "PATCH",
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const json = await response.json();
      if (!response.ok) {
        setError(json.error);
      }
      if (response.ok) {
        setAgenceDetails(json);
        window.location.reload();
      }
    } catch (error) {
      setError(error.message);
    }
  };



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
  const navigate = useNavigate()
  const updateUrl = (id) => {
    navigate(`?id=${id}`);
  };




  // const turnOff = (
  //   <Button component="label" variant="contained" style={{backgroundColor:'red'}} endIcon={<ToggleOffIcon />} onClick={updateState}>
  //     Inactive
  //   </Button>
  // );
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

        <TableCell align='center' >
          <div style={{ paddingRight: "10px" }}>
            {<ModelUpdateAgence agenceId={agence._id} updateUrl={updateUrl} />}

            <FormControlLabel
              control={
                <Button  onClick={updateState} disableRipple>
                  <Switch defaultChecked={agence.state === "active"} />
                </Button>
              }
              label={agence.state === "active" ? "active" : "inactive"}

            />
          </div>
        </TableCell>

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
