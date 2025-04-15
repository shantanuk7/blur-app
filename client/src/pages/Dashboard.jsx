import React, { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Attempt to fetch protected data
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const res = await API.get('/dashboard', { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        setDashboardData(res.data.message);
      } catch (err) {
        console.error(err);
        // If token becomes invalid, you can redirect the user to login
        navigate('/login');
      }
    };
    fetchData();
  }, [navigate]);

  return (
    <div>
      <h2>Notes</h2>
      <p>{dashboardData}</p>
    </div>
  );
};

export default Dashboard;
