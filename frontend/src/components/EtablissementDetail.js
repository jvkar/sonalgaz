import { useState, useEffect } from "react";
import { useEtablissementContext } from "../hooks/useEtablissementContext";
import { useAuthContext } from "../hooks/useAuthContext";
import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import TableHead from "@mui/material/TableHead";
import { BsArrowRightCircleFill } from "react-icons/bs";
import "../index.css";
import { Button } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SnackBar from "./SnackBar";
import ModelUpdateEntreprise from "./models/modelUpdateEntreprise";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import ModelArchive from "./models/modelArchive";
import ModelArchiveEntreprise from "./models/modelArchiveEntreprise";
const EtablissementDetails = ({ etablissement }) => {
  const { user } = useAuthContext();
  const userType = user.userType;
  const [etablissements, setEtablissements] = useState(etablissement);
  const [blackList, setBlackList] = useState(etablissement);
  const [assignedCoupure, setassignedCoupure] = React.useState([]);
  const [assignedRetab, setassignedRetab] = React.useState([]);
  const [error, setError] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [affect, setAffect] = useState(false);
  const [affect2, setAffect2] = useState(false);
  const [message, setMessage] = useState(undefined);
  const [open, setOpen] = React.useState(false);
  const affecterCoupure = async () => {
    setAffect(true);
    const response = await fetch(
      `/api/Clients/affecterCoupure/${etablissement._id}`,
      {
        method: "PATCH",
      }
    );
    const json = await response.json();
    if (response.ok) {
      setMessage("affectation avec succes");
      setTimeout(() => {
        setMessage("");
      }, 3000);
      setAffect(false);
    }
    if (!response.ok) {
      setError(json.error);
      setTimeout(() => {
        setError("");
      }, 3000);
      setAffect(false);
    }
  };
  const affecterRetablissement = async () => {
    setAffect2(true);
    const response = await fetch(
      `/api/Clients/affecterRetab/${etablissement._id}`,
      {
        method: "PATCH",
      }
    );
    const json = await response.json();
    if (response.ok) {
      setMessage("affectation avec succes");
      setTimeout(() => {
        setMessage("");
      }, 3000);
      setAffect2(false);
    }
    if (!response.ok) {
      setError(json.error);
      setTimeout(() => {
        setError("");
      }, 3000);
      setAffect2(false);
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
      setBlackList(json);
    }
    if (!response.ok) {
      setError(json.error);
    }
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
        setIsLoading(false);
      }
    };
    if (user) {
      fetchCoupureData();
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
        setIsLoading(false);
      }
    };
    if (user) {
      fetchRetabData();
    }
  }, [assignedRetab, user]);



  const navigate = useNavigate();
  const updateUrl = (id) => {
    navigate(`?id=${id}`);
  };


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
      {message && <div className="message">{message}</div>}

      <TableRow sx={{ "& > *": { borderBottom: "unset" } }} style={{backgroundColor:(etablissement?.timesInBlackList==3 ? "red" : "white")}}>
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
        <TableCell align="center" style={{color:(etablissement?.timesInBlackList==3 ? "white" : "black")}}>
          {etablissement?.NumeroEtablissement}
        </TableCell>
        <TableCell align="center" style={{color:(etablissement?.timesInBlackList==3 ? "white" : "black")}}>{etablissement?.Nom} </TableCell>
        <TableCell align="center" style={{color:(etablissement?.timesInBlackList==3 ? "white" : "black")}}>{etablissement?.Adresse}</TableCell>
          <TableCell align="center" style={{color:(etablissement?.timesInBlackList==3 ? "white" : "black")}}>
            {etablissement?.timesInBlackList}
          </TableCell>
        

        <TableCell align="center" style={{color:(etablissement?.timesInBlackList==3 ? "white" : "black")}}>
          {etablissement?.affectationCoupure}
        </TableCell>
        <TableCell align="center" style={{color:(etablissement?.timesInBlackList==3 ? "white" : "black")}}>
          {etablissement?.affectationRetablissement}
        </TableCell>

        {userType === "CadreAgence" ? (
          <TableCell align="center">
            {etablissement?.timesInBlackList!==3 &&
            <div style={{ paddingRight: "10px" }}>
              <Button
                style={{ margin: "2px" }}
                onClick={affecterCoupure}
                component="label"
                variant="contained"
                endIcon={<BsArrowRightCircleFill />}
                disabled={affect}
              >
                {affect ? "affecting..." : "coupure"}
              </Button>
              <Button
                style={{ margin: "2px" }}
                onClick={affecterRetablissement}
                component="label"
                variant="contained"
                endIcon={<BsArrowRightCircleFill />}
                disabled={affect2}
              >
                {affect2 ? "affecting..." : "retablissement"}
              </Button>
              <Button style={{ margin: "2px"  }} onClick={addToBlackList}>
                {" "}
                <SnackBar blackList={etablissement.timesInBlackList} />{" "}
              </Button>
            </div>
            }
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

              {<ModelArchiveEntreprise etablissementId={etablissement._id} />}
            </div>
          </TableCell>
        )}
      </TableRow>
      {userType === "CadreAgence" ? (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <ModelArchive etablissementId={etablissement._id} />

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
                          <TableCell>Reference</TableCell>
                          <TableCell>Nom</TableCell>
                          <TableCell>Adresse</TableCell>
                          <TableCell>etat</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {isLoading === true ? (
                          <TableRow
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "100%",
                            }}
                          >
                            <CircularProgress style={{ margin: "15px" }} />
                          </TableRow>
                        ) : (
                          <>

                            {assignedCoupure.length !== 0 ? (
                              assignedCoupure.map((coupure, index) => (
                                <TableRow key={index}>
                                  <TableCell component="th" scope="row">
                                    {coupure.codeClient}
                                  </TableCell>
                                  <TableCell>
                                    {coupure.referenceClient}
                                  </TableCell>
                                  <TableCell>{coupure.nomClient}</TableCell>
                                  <TableCell>{coupure.adresseClient}</TableCell>
                                  <TableCell>{coupure.etat}</TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={5}>
                                  <h1>There's no data</h1>
                                </TableCell>
                              </TableRow>
                            )}
                          </>
                        )}
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
                          <TableCell>Reference</TableCell>
                          <TableCell>Nom</TableCell>
                          <TableCell>Adresse</TableCell>
                          <TableCell>Etat</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {isLoading == true ? (
                          <TableRow
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "100%",
                            }}
                          >
                            {" "}
                            <CircularProgress style={{ margin: "15px" }} />{" "}
                          </TableRow>
                        ) : assignedRetab.length !== 0 ? (
                          assignedRetab?.map((retablissement, index) => (
                            <TableRow key={index}>
                              <TableCell component="th" scope="row">
                                {retablissement.codeClient}
                              </TableCell>
                              <TableCell>
                                {retablissement.referenceClient}
                              </TableCell>
                              <TableCell>{retablissement.nomClient}</TableCell>
                              <TableCell>
                                {retablissement.adresseClient}
                              </TableCell>
                              <TableCell>{retablissement.etat}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <h1>there s no data</h1>
                        )}
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
