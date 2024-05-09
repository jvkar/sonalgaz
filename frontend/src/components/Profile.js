import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/joy/Typography";
const Profile = () => {
  const { user } = useAuthContext();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const navigate = useNavigate();
  const goToChangePassword = () => {
    navigate("/passwordChange");
  };
  return (
    <>
      {user && (
        <div className="prof"
          style={{

          }}
        >
          {user.userType !== "technicien" && (
            <Typography>
              SONALGAZ Société algérienne de l'électricité et du Gaz -
              Distribution 2023-2024
            </Typography>
          )}
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            style={{ top: "48px" }}
          >
            <MenuItem onClick={goToChangePassword}>
              Changer le mot de pass
            </MenuItem>
          </Menu>
        </div>
      )}
    </>
  );
};

export default Profile;
