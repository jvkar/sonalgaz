import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuthContext } from "../hooks/useAuthContext";
import ArchiveListeEntreprise from "../components/ArchiveListeEntreprise";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useParams } from "react-router-dom";

const ArchiveEntreprisePage = () => {
  const { user } = useAuthContext();
  const { id } = useParams();
  const [entreprises, setEntreprise] = useState([]);
  const [filtredEntreprises, setFiltredEntreprises] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState("");


  useEffect(() => {
    const fetchArchivedEntreprises = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/Etablissements/getArchived', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const json = await response.json();
        if (response.ok) {
            setEntreprise(json);
            setFiltredEntreprises(json);
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
        fetchArchivedEntreprises();
    }
  }, [user]);

  useEffect(() => {
    const filterEntreprise = () => {
      let filtered = entreprises;

      if (selectedYear) {
        filtered = filtered.filter(entreprises => new Date(entreprises.updatedAt).getFullYear() === parseInt(selectedYear));
      }



      setFiltredEntreprises(filtered);
    };

    filterEntreprise();
  }, [selectedYear, entreprises]);

  return (
    <div className="list">
      <div className="Title" style={{ marginBottom: "20px" }}>
        <h1>La liste des entreprises archivés </h1>
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
          {Array.from(new Set(entreprises.map(entreprise => new Date(entreprise.updatedAt).getFullYear()))).map(year => (
          <MenuItem key={year} value={year}>         
            {year}
        </MenuItem>
          ))}

        </Select>
      </FormControl>
      </div>


      <TableContainer component={Paper}>
        <Table>
          <TableRow>
          <TableCell align="center">Numéro de l'entreprise</TableCell>
            <TableCell align="center">Nom de l'entreprise</TableCell>
            <TableCell align="center">Nombre de fois dans la liste noire</TableCell>            
            <TableCell align="center">nombre de coupures dans {new Date().getFullYear()}</TableCell>
            <TableCell align="center">nombre de retablissements dans {new Date().getFullYear()}</TableCell>
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
                filtredEntreprises.map(entreprise => (
                <ArchiveListeEntreprise key={entreprise._id} etablissement={entreprise} />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ArchiveEntreprisePage;
