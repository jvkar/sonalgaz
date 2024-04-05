import { useState, useEffect } from "react";
import { useEtablissementContext } from "../hooks/useEtablissementContext";
import { useAuthContext } from "../hooks/useAuthContext";
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
import { BsArrowRightCircle } from "react-icons/bs";
import { BsArrowRightCircleFill } from "react-icons/bs";
import "../index.css";
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";
import { LuPencilLine } from "react-icons/lu";
import { Margin } from "@mui/icons-material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SnackBar from "./SnackBar";
import Archiver from "../components/buttons/archiveButton";
import ModelUpdateEntreprise from "./models/modelUpdateEntreprise";
import { useNavigate } from "react-router-dom";

const EtablissementDetails = ({ etablissement }) => {
  const { user } = useAuthContext();
  const userType = user.userType;
  const [etablissements,setEtablissements]= useState(etablissement)
  const [assignedCoupure, setassignedCoupure] = React.useState([]);
  const [assignedRetab, setassignedRetab] = React.useState([]);
  const [error, setError] = useState(undefined);


  const [open, setOpen] = React.useState(false);
  const affecterCoupure = async () => {
    const response = await fetch(
      `/api/Clients/affecterCoupure/${etablissement._id}`,
      {
        method: "PATCH",
      }
    );
    const json = await response.json();
    if (response.ok) {
      alert("coupure affecter");
    }
    if (!response.ok) {
      setError(json.error);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };
  const affecterRetablissement = async () => {
    const response = await fetch(
      `/api/Clients/affecterRetab/${etablissement._id}`,
      {
        method: "PATCH",
      }
    );
    const json = await response.json();
    if (response.ok) {
      alert("retablissement affecter");
    }
    if (!response.ok) {
      setError(json.error);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };
  const addToBlackList = async (e) => {
    if (!user) {
      setError("You must be logged in");
      return;
    }
    e.preventDefault();

    const response = await fetch(
      `/api/Etablissements/BlackListAdd/${etablissement._id}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );
    const json = response.json();
    if (response.ok) {
      window.location.reload();
    }
    if (!response.ok) {
      setError(json.error);
    }
  };
  const handleUpdate = async () => {
    if (!user) {
      setError("You must be logged in");
      return;
    }

    window.location.href = `/UpdateFormEtablissement/${etablissement._id}`;
  };
  useEffect(() => {
    const fetchCoupureData = async () => {
      const response = await fetch(
        `/api/Clients/coupurePerEtab/${etablissement._id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const json = await response.json();
      if (response.ok) {
        const allClients = json.flatMap((enterprise) => enterprise.clients);
        setassignedCoupure(allClients);
        
      }
    };
    if (user) {
      setTimeout(()=>{

        fetchCoupureData();
      },3000)
    }
  }, [assignedCoupure, user]);
  useEffect(() => {
    const fetchRetabData = async () => {
      const response = await fetch(
        `/api/Clients/retabPerEtab/${etablissement._id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const json = await response.json();
      if (response.ok) {
        const allClients = json.flatMap((enterprise) => enterprise.clients);
        setassignedRetab(allClients);

      }
    };
    if (user) {
      setTimeout(()=>{

        fetchRetabData();
      },3000)
    }
  }, [assignedRetab, user]);

  const { dispatch } = useEtablissementContext();

  const handleClick = async () => {

    if (!user) {
      return;
    }
    const response = await fetch(
      `/api/Etablissements/del/${etablissement._id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );
    const json = await response.json();
    
    if (response.ok) {
      dispatch({ type: "DELETE_ETABLISSEMENT", payload: json });
      setEtablissements(json)
    }
    if(!response.ok){
      setError(json.error)
    }
    
  };
  const archiveList = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `/api/Clients/archiver/${etablissement._id}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const json = await response.json();
      if (!response.ok) {
        setError(json.error);
      }
    } catch (error) {
      setError(error);
    }
  };

  const navigate = useNavigate();
  const updateUrl = (id) => {
    navigate(`?id=${id}`);
  };

  const icon3 = (
    <Button
      component="label"
      variant="contained"
      endIcon={<BsArrowRightCircleFill />}
    >
      Coupures
    </Button>
  );

  const icon5 = (
    <Button
      component="label"
      variant="outlined"
      endIcon={<BsArrowRightCircle />}
    >
      Retablissement
    </Button>
  );

  const icon1 = (
    <button
      onClick={handleUpdate}
      style={{
        marginRight: "25px",
        backgroundColor: "transparent",
        borderColor: "transparent",
        cursor: "pointer",
      }}
    >
      <LuPencilLine style={{ width: "24px", height: "24px" }} />
    </button>
  );

  const icon2 = (
    <button
      onClick={handleClick}
      style={{
        backgroundColor: "transparent",
        borderColor: "transparent",
        cursor: "pointer",
      }}
    >
      <img
        width="24px"
        height="24px"
        src="https://img.icons8.com/material-rounded/24/filled-trash.png"
        alt="filled-trash"
      />{" "}
    </button>
  );
  useEffect(() => {

    const timeoutDuration = 3000;


    if (error) {
      const timeoutId = setTimeout(() => {
        setError(null);
      }, timeoutDuration);


      return () => clearTimeout(timeoutId);
    }
  }, [error]);
  return (
    <React.Fragment>

      {error && <div className="error">{error}</div>}

      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        {userType === "CadreAgence" ? (
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        ) : (
          <></>
        )}
        <TableCell align="center">
          {etablissement?.NumeroEtablissement}
        </TableCell>
        <TableCell align="center">{etablissement?.Nom} </TableCell>
        <TableCell align="center">{etablissement?.Adresse}</TableCell>
        {userType == "CadreAgence" ? (
          <TableCell align="center">
            {etablissement?.timesInBlackList}
          </TableCell>
        ) : (
          <></>
        )}

        <TableCell align="center">
          {etablissement?.affectationCoupure}
        </TableCell>
        <TableCell align="center">
          {etablissement?.affectationRetablissement}
        </TableCell>

        {userType === "CadreAgence" ? (
          <TableCell align="center">
            <div style={{ paddingRight: "10px" }}>
              <Button style={{ margin: "2px" }} onClick={affecterCoupure}>
                {" "}
                {icon3}{" "}
              </Button>
              <Button
                style={{ margin: "2px" }}
                onClick={affecterRetablissement}
              >
                {icon5}{" "}
              </Button>
              <Button style={{ margin: "2px" }} onClick={addToBlackList}>
                {" "}
                <SnackBar />{" "}
              </Button>
            </div>
          </TableCell>
        ) : (
          <TableCell align="center">
            <div style={{ paddingRight: "10px" }}>
              {
                <ModelUpdateEntreprise
                  entrepriseId={etablissement._id}
                  updateUrl={updateUrl}
                />
              }

              {icon2}
            </div>
          </TableCell>
        )}
      </TableRow>
      {userType === "CadreAgence" ? (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Button style={{ margin: "2px" }} onClick={archiveList}>
                  {" "}
                  <Archiver />{" "}
                </Button>
                <Accordion style={{ backgroundColor: "#EEEEEE" }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    Les Coupures de l'entreprise {etablissement?.Nom}
                  </AccordionSummary>
                  <AccordionDetails>
                    <Table size="small" aria-label="purchases">
                      <TableHead>
                        <TableRow>
                          <TableCell>Code</TableCell>
                          <TableCell>Nom</TableCell>
                          <TableCell align="right">Adresse</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {assignedCoupure.length!==0 ? ( assignedCoupure?.map((coupure, index) => (
                            <TableRow key={index}>
                              <TableCell component="th" scope="row">
                                {coupure.codeClient}
                              </TableCell>
                              <TableCell>{coupure.nomClient}</TableCell>
                              <TableCell align="right">
                                {coupure.adresseClient}
                              </TableCell>
                            </TableRow>
                          )))
                        :
                        (<h1>thers no data</h1>)}
                        {!assignedCoupure && <div><h3>loading data ....</h3></div>}
                      </TableBody>
                    </Table>
                  </AccordionDetails>
                </Accordion>
                <Accordion style={{ backgroundColor: "#EEEEEE" }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                  >
                    Les Retablissements de l'entreprise {etablissement?.Nom}
                  </AccordionSummary>
                  <AccordionDetails>
                    <Table size="small" aria-label="purchases">
                      <TableHead>
                        <TableRow>
                          <TableCell>Code</TableCell>
                          <TableCell>Nom</TableCell>
                          <TableCell align="right">Adresse</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {assignedRetab.length!==0?
                          (assignedRetab?.map((retablissement, index) => (
                            <TableRow key={index}>
                              <TableCell component="th" scope="row">
                                {retablissement.codeClient}
                              </TableCell>
                              <TableCell>{retablissement.nomClient}</TableCell>
                              <TableCell align="right">
                                {retablissement.adresseClient}
                              </TableCell>
                            </TableRow>
                          )))
                          :
                          (<h1>there s no data</h1>)
                          }
                          {!assignedRetab && <div><h3>loading data ....</h3></div>}
                      </TableBody>
                    </Table>
                  </AccordionDetails>
                </Accordion>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      ) : (
        <></>
      )}
    </React.Fragment>
  );
};
export default EtablissementDetails;
