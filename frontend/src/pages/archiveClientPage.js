import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuthContext } from "../hooks/useAuthContext";
import ArchiveListeClient from "../components/ArchiveListeClient";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useParams } from "react-router-dom";

const ArchiveClientPage = () => {
  const { user } = useAuthContext();
  const { id } = useParams();
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState("coupure");
  const [selectedYear, setSelectedYear] = useState("");

  const Nom = user.nom;

  useEffect(() => {
    const fetchArchivedClients = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/Clients/getArchived/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const json = await response.json();
        if (response.ok) {
          setClients(json);
          setFilteredClients(json);
        } else {
          setError(json.error);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchArchivedClients();
    }
  }, [user, id]);

  useEffect(() => {
    const filterClients = () => {
      let filtered = clients;

      if (selectedYear) {
        filtered = filtered.filter(client => new Date(client.updatedAt).getFullYear() === parseInt(selectedYear));
      }

      if (filterType) {
        filtered = filtered.filter(client => client.typeClient === filterType);
      }

      setFilteredClients(filtered);
    };

    filterClients();
  }, [selectedYear, filterType, clients]);

  return (
    <div className="list">
      <div className="Title" style={{ marginBottom: "20px" }}>
        <h1>La liste des clients archivés de l'agence de {Nom}</h1>
      </div>

      <div style={{ marginBottom: "20px" , display:"flex",alignItems:"center"}}>
        <label htmlFor="year">Filtrer par année : </label>

        <FormControl sx={{ m: 1, minWidth: 180}}>
        <InputLabel id="demo-simple-select-helper-label">année</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={selectedYear}
          label="Year"
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <MenuItem value="">
            <em>Toutes les années</em>
          </MenuItem>
          {Array.from(new Set(clients.map(client => new Date(client.updatedAt).getFullYear()))).map(year => (
          <MenuItem key={year} value={year}>         
            {year}
        </MenuItem>
          ))}

        </Select>
      </FormControl>
      </div>

      <div style={{ marginBottom: "20px" , display:"flex",alignItems:"center"}}>
        <label htmlFor="type">Filtrer par type : </label>
        <FormControl sx={{ m: 1, minWidth: 180 }}>
        <InputLabel id="demo-simple-select-helper-label">Type</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={filterType}
          label="Type"
          onChange={(e) => setFilterType(e.target.value)}
        >

          <MenuItem  value={"coupure"}>         
            coupure
        </MenuItem>
          <MenuItem  value={"retablissement"}>         
            retablissement
        </MenuItem>


        </Select>
      </FormControl>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableRow>
            <TableCell align="center">Code Client</TableCell>
            <TableCell align="center">Référence Client</TableCell>
            <TableCell align="center">Nom Client</TableCell>
            <TableCell align="center">Adresse Client</TableCell>
            <TableCell align="center">Numéro Compteur</TableCell>
            <TableCell align="center">Type Client</TableCell>
            <TableCell align="center">État Client</TableCell>
          </TableRow>
          <TableBody>
            {isLoading ? (
              <TableRow style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                <CircularProgress style={{ margin: "15px" }} />
              </TableRow>
            ) : error ? (
              <TableRow style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                <TableCell colSpan={7} align="center" style={{ color: "red" }}>
                  {error}
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map(client => (
                <ArchiveListeClient key={client._id} client={client} />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ArchiveClientPage;
