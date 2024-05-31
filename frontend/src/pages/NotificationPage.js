// src/components/NotificationsList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Notification from '../components/Notification';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
const NotificationsList = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext() 
    const {id} = useParams()
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`/api/Etablissements/getNotification/${id}`,{
            headers: { 'Authorization': `Bearer ${user.token}` },

        });
        const jsonData = await response.json();

        setNotifications(jsonData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user,id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="notifications-list">
        <h1>notification list</h1>
      {
        notifications?.map((notification, index) => (
          <Notification key={index} notification={notification} />
        ))
      }
    </div>
  );
};

export default NotificationsList;
