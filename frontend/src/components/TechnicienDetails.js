import * as React from "react";
import { useEffect, useState } from "react";

import { useAuthContext } from "../hooks/useAuthContext";
import { useParams } from "react-router-dom";
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
import ModelUpdateTechnicien from "./models/modelUpdateTechnicien";
import { useNavigate } from "react-router-dom";
import Archiver from "../components/buttons/archiveButton";
import CircularProgress from "@mui/material/CircularProgress";

const TechnicienDetails = ({ technicien }) => {
  const { user } = useAuthContext();
  const userType = user.userType;
  const [isLoading , setIsLoading] = useState(true)
  const [assignedCoupures, setAssignedCoupures] = useState([]);
  const [assignedRetablissements, setAssignedRetablissements] = useState([]);
  const [error, setError] = useState(undefined);
  const [open, setOpen] = React.useState(false);
  const { id } = useParams();
  const affecterCoupure = async () => {
    const response = await fetch(
      `/api/Techniciens/affecterCoupure/${id}/${technicien._id}`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${user.token}` },
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
      `/api/Techniciens/affecterRetablissment/${id}/${technicien._id}`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${user.token}` },
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
  useEffect(() => {
    const fetchCoupureData = async () => {
      const response = await fetch(
        `/api/Techniciens/coupurePerEtab/${technicien._id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const json = await response.json();
      if (response.ok) {
        setAssignedCoupures(json);
        setIsLoading(false)
      }
      if (!response.ok) {
        setError(json.error);
      }
    };
    if (user) {

        fetchCoupureData();

    }
  }, [assignedCoupures, user]);
  useEffect(() => {
    const fetchRetabData = async () => {
      const response = await fetch(
        `/api/Techniciens/retabPerEtab/${technicien._id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const json = await response.json();
      if (response.ok) {
        setAssignedRetablissements(json);
        setIsLoading(false)
      }
      if (!response.ok) {
        setError(json.error);
      }
    };
    if (user) {

        fetchRetabData();

    }
  }, [assignedRetablissements, user]);

  useEffect(() => {
    const timeoutDuration = 3000;

    if (error) {
      const timeoutId = setTimeout(() => {
        setError(null);
      }, timeoutDuration);

      return () => clearTimeout(timeoutId);
    }
  }, [error]);
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
  // const icon2 = (
  //   <button
  //     onClick={handleClick}
  //     style={{
  //       backgroundColor: "transparent",
  //       borderColor: "transparent",
  //       cursor: "pointer",
  //     }}
  //   >
  //     <img
  //       width="24px"
  //       height="24px"
  //       src="https://img.icons8.com/material-rounded/24/filled-trash.png"
  //       alt="filled-trash"
  //     />{" "}
  //   </button>
  // );
  const navigate = useNavigate();
  const updateUrl = (id) => {
    navigate(`?id=${id}`);
  };
  return (
    <React.Fragment>
      {error && <div className="error">{error}</div>}

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

        <TableCell align="center">{technicien?.codeTechnicien}</TableCell>
        <TableCell align="center">{technicien?.nomTechnicien} </TableCell>
        <TableCell align="center">{technicien?.username}</TableCell>

        <TableCell align="center">
          <div style={{ paddingRight: "10px" }}>
            <Button style={{ margin: "2px" }} onClick={affecterCoupure}>
              {" "}
              {icon3}{" "}
            </Button>
            <Button style={{ margin: "2px" }} onClick={affecterRetablissement}>
              {icon5}{" "}
            </Button>
          </div>
        </TableCell>
        <TableCell align="center">
          <div style={{ paddingRight: "10px" }}>
            {
              <ModelUpdateTechnicien
                technicienId={technicien._id}
                updateUrl={updateUrl}
              />
            }


          </div>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Button style={{ margin: "2px" }}>
                {" "}
                <Archiver />{" "}
              </Button>
              <Accordion style={{ backgroundColor: "#EEEEEE" }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  Les Coupures du technicien {technicien?.nomTechnicien}
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
                    
                    {isLoading == true ? (<TableRow style={{display:"flex",justifyContent:"center",alignItems:"center",width:"100%"}}>    <CircularProgress style={{margin:"15px"}}/>          </TableRow>) :( 
                      assignedCoupures.length !== 0 ? (
                        assignedCoupures?.map((coupure) => (
                          <TableRow key={coupure._id}>
                            <TableCell component="th" scope="row">
                              {coupure.codeClient}
                            </TableCell>
                            <TableCell>{coupure.nomClient}</TableCell>
                            <TableCell align="right">
                              {coupure.adresseClient}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (<h1>there s no data</h1>)
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
                  Les Retablissements du technicien {technicien?.nomTechnicien}
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
                    {isLoading == true ? (<TableRow style={{display:"flex",justifyContent:"center",alignItems:"center",width:"100%"}}>    <CircularProgress style={{margin:"15px"}}/>          </TableRow>) :( 

                      assignedRetablissements.length !== 0 ? (
                        assignedRetablissements?.map((retablissement) => (
                          <TableRow key={retablissement._id}>
                            <TableCell component="th" scope="row">
                              {retablissement.codeClient}
                            </TableCell>
                            <TableCell>{retablissement.nomClient}</TableCell>
                            <TableCell align="right">
                              {retablissement.adresseClient}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (<h1>there s no data</h1>)
                    )}

                    </TableBody>
                  </Table>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};
export default TechnicienDetails;
