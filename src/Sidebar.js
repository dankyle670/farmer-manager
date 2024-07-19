import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaChartBar, FaTasks, FaUsers, FaWrench } from 'react-icons/fa';
import './Sidebar.css';

function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Farm Manager</h2>
      </div>
      <nav className="sidebar-nav">
        <button className="sidebar-button" onClick={() => navigate('/home')}>
          <FaHome className="sidebar-icon" />
          Home
        </button>
        <button className="sidebar-button" onClick={() => navigate('/reports')}>
          <FaChartBar className="sidebar-icon" />
          Reports
        </button>
        <button className="sidebar-button" onClick={() => navigate('/tasks')}>
          <FaTasks className="sidebar-icon" />
          Tasks
        </button>
        <button className="sidebar-button" onClick={() => navigate('/users')}>
          <FaUsers className="sidebar-icon" />
          Users
        </button>
        <button className="sidebar-button" onClick={() => navigate('/actions')}>
          <FaWrench className="sidebar-icon" />
          Actions
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;
