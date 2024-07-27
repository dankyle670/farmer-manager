import React, { useState, useEffect } from 'react';
import './Reports.css';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Reports() {
  const [logs, setLogs] = useState([]);
  const [financials, setFinancials] = useState([]);
  const [view, setView] = useState('table'); // 'table' or 'chart'
  const [selectedFarm, setSelectedFarm] = useState(''); // State for selected farm
  const [farms, setFarms] = useState([]); // State to store farm data
  const [isFinancialsModalOpen, setIsFinancialsModalOpen] = useState(false); // State for managing modal visibility
  const [selectedFarmId, setSelectedFarmId] = useState(''); // State for selected farm in modal
  const [financialsData, setFinancialsData] = useState({ // State for managing financial input data
    spent: 0,
    spent_com: '',
    earnings: 0,
    earnings_com: '',
    profit: 0,
    turnover: 0,
  });

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/logs`);
        setLogs(response.data);
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };

    const fetchFinancials = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/financials`);
        console.log('Financials API Response:', response.data); // Debug: Log API response
        setFinancials(response.data);
      } catch (error) {
        console.error('Error fetching financials:', error);
      }
    };

    const fetchFarms = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/farms`);
        setFarms(response.data);
        if (response.data.length > 0) {
          setSelectedFarm(response.data[0]._id); // Set the initial selected farm
        }
      } catch (error) {
        console.error('Error fetching farms:', error);
      }
    };

    fetchLogs();
    fetchFinancials();
    fetchFarms();
  }, []);

  const last10Logs = logs.slice(-10);

  const handleSaveToFile = () => {
    const logText = logs.map(log => `User: ${log.user}, IP: ${log.ip}, Action: ${log.action}, Date: ${log.date}`).join('\n');
    const blob = new Blob([logText], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'logs.txt');
  };

  return (
    <div className="reports-container">
      <h2>Reports</h2>

      <h4>Action Logs</h4>
      <table className="reports-table">
        <thead>
          <tr>
            <th>User</th>
            <th>IP</th>
            <th>Action</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {last10Logs.map((log, index) => (
            <tr key={index}>
              <td>{log.user}</td>
              <td>{log.ip}</td>
              <td>{log.action}</td>
              <td>{new Date(log.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSaveToFile}>Save to File</button>


    </div>
  );
}

export default Reports;
