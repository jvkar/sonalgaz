import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Typography from "@mui/joy/Typography";
import Notification from "./Notification";
import Button from "@mui/joy/Button";

const Profile = () => {
  const { user } = useAuthContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `/api/Etablissements/getNotification/${user?.entreprise}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const jsonData = await response.json();
        console.log(jsonData);

        if (Array.isArray(jsonData)) {
          setNotifications(jsonData);
        } else {
          console.error("Fetched data is not an array:", jsonData);
          setNotifications([]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const handleMenuNotifications = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorEl2(null);
  };

  const goToChangePassword = () => {
    navigate("/passwordChange");
  };
  const deleteAll = async () => {
    try {
      const response = await fetch(
        `/api/Etablissements/${user?.entreprise}/notifications`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const json = response.json();
      if (response.ok) {
        setNotifications([]);
      }
      if (!response.ok) {
        setError(json.error);
      }
    } catch (error) {
      setError(error);
    }
  };
  return (
    <>
      {user && (
        <div className="prof">
          {user.userType !== "technicien" && (
            <Typography>
              SONALGAZ Société algérienne de l'électricité et du Gaz -
              Distribution 2023-2024
            </Typography>
          )}
          <div style={{}}>
            {user.userType === "responsableEntreprise" && (
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenuNotifications}
                color="inherit"
              >
                <NotificationsIcon />
              </IconButton>
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
          </div>
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
              Changer le mot de passe
            </MenuItem>
          </Menu>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl2}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl2)}
            onClose={handleClose}
            style={{ top: "48px" }}
          >
            {loading ? (
              <MenuItem>Loading...</MenuItem>
            ) : (
              <div style={{ width: "auto" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px",
                  }}
                >
                  <h1 style={{ fontSize: "20px" }}>Les Notifications</h1>
                  <Button disabled={notifications.length==0} onClick={deleteAll}> suprimmer tout </Button>
                </div>
                {notifications.length==0 ? (
                  <p style={{textAlign:"center"}}>Pas de notification</p>
                ) : (
                  notifications.map((notification, index) => (
                    <MenuItem key={index}>
                      <Notification notification={notification} />
                    </MenuItem>
                  ))
                )}
              </div>
            )}
          </Menu>
        </div>
      )}
    </>
  );
};

export default Profile;
