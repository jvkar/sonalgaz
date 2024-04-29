import React, { useEffect, useState } from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { useClientContext } from "../hooks/useClientContext";
import { useAuthContext } from "../hooks/useAuthContext";
import CauseModal from "./models/causeModal";
import { useNavigate } from "react-router-dom";
const RetablissementDetails = ({ retablissement }) => {
  const { user } = useAuthContext();
  const userType = user.userType;
  const navigate = useNavigate();
  const updateUrl = (id) => {
    navigate(`/?id=${id}`);
  };
  return (
    <React.Fragment>
      <TableRow>
        <TableCell component="th" scope="row">
          {retablissement?.codeClient}
        </TableCell>
        {userType != "technicien" && (
          <TableCell>{retablissement?.referenceClient}</TableCell>
        )}
        <TableCell>{retablissement?.nomClient}</TableCell>
        {userType != "technicien" && (
          <TableCell>{retablissement?.adresseClient}</TableCell>
        )}
        {userType != "technicien" && (
          <TableCell>{retablissement?.numeroCompteur}</TableCell>
        )}
        {userType != "technicien" && (
          <TableCell>{retablissement?.typeClient}</TableCell>
        )}

        {userType === "CadreAgence" ? (
          <TableCell
            style={{
              color: retablissement?.archived === "archiver" ? "green" : "red",
            }}
          >
            {retablissement?.archived}
          </TableCell>
        ) : (
          <></>
        )}
        <TableCell
          style={{
            color:
              retablissement?.etat === "valider"
                ? "green"
                : retablissement?.etat === "invalider"
                ? "red"
                : "blue",
          }}
        >
          {retablissement?.etat}
        </TableCell>
        {retablissement.etat === "invalider" && (
          <TableCell>{<CauseModal clientId={retablissement._id}  updateUrl={updateUrl}/>}</TableCell>
        )}
      </TableRow>
    </React.Fragment>
  );
};
export default RetablissementDetails;
