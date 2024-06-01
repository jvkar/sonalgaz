import React, { useState } from 'react';
import coupureImage from '../images/coupure.png';
import retablissementImage from '../images/retab.png';
import { MdClose } from "react-icons/md";
import { useAuthContext } from '../hooks/useAuthContext';
import Button from "@mui/material/Button";

const Notification = ({ notification }) => {
  const { user } = useAuthContext();
  const [error, setError] = useState(undefined);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };
  const formattedDate = formatDate(notification.date);

  return (
    <div className="notification">
      {notification.message === "Les techniciens ont signalé toutes les coupures" && (
        <>
          <img src={coupureImage} alt="coupure logo" className='coupureLogo' />
          <p><b>{notification.message}</b> <br />  {formattedDate}</p>
        </>
      )}
      {notification.message === "Les techniciens ont signalé tous les retablissements" && (
        <>
          <img src={retablissementImage} alt="retablissement logo" className='retablissementLogo' />
          <p><b>{notification.message}</b> <br />  {formattedDate}</p>
        </>
      )}
      {user.userType === "technicien" &&
        <>
          <Button ><MdClose/></Button>
          <p><b>{notification.message}</b> <br />  {formattedDate}</p>
        </>
      }
    </div>
  );
};

export default Notification;
