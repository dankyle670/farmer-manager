import React, { useState, useEffect } from 'react';
import './Reports.css';
import axios from 'axios';
import { saveAs } from 'file-saver';

function Reports() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios.get(`${apiUrl}/api/logs`);
        setLogs(response.data);
      } catch (error) {
        console.error('Error fetching logs!', error);
      }
    };

    fetchLogs();
  }, []);

  const handleSaveToFile = () => {
    const logText = logs.map(log => `Name: ${log.user}, IP: ${log.ip}, Action: ${log.action}, Date: ${new Date(log.date).toLocaleString()}`).join('\n');
    const blob = new Blob([logText], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'action_logs.txt');
  };

  return (
    <div className="reports-container">
      <h3>Reports</h3>
      <table className="reports-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>IP</th>
            <th>Action</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index}>
              <td>{log.user}</td>
              <td>{log.ip}</td>
              <td>{log.action}</td>
              <td>{new Date(log.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSaveToFile}>Save Logs to File</button>
    </div>
  );
}

export default Reports;



//import React, { useState, useEffect } from 'react';
//import './Reports.css';
//import axios from 'axios';
//import { saveAs } from 'file-saver';
//
//function Reports() {
//  const [logs, setLogs] = useState([]);
//
//  useEffect(() => {
//    const fetchLogs = async () => {
//      try {
//        const apiUrl = process.env.REACT_APP_API_URL;
//        const response = await axios.get(`${apiUrl}/api/logs`);
//        setLogs(response.data);
//      } catch (error) {
//        console.error('Error fetching logs!', error);
//      }
//    };
//
//    fetchLogs();
//  }, []);
//
//  const handleSaveToFile = () => {
//    const logText = logs.map(log => `Name: ${log.user}, IP: ${log.ip}, Action: ${log.action}, Date: ${new Date(log.date).toLocaleString()}`).join('\n');
//    const blob = new Blob([logText], { type: 'text/plain;charset=utf-8' });
//    saveAs(blob, 'action_logs.txt');
//  };
//
//  return (
//    <div className="reports-container">
//      <h3>Reports</h3>
//      <table className="reports-table">
//        <thead>
//          <tr>
//            <th>Name</th>
//            <th>IP</th>
//            <th>Action</th>
//            <th>Date</th>
//          </tr>
//        </thead>
//        <tbody>
//          {logs.map((log, index) => (
//            <tr key={index}>
//              <td>{log.user}</td>
//              <td>{log.ip}</td>
//              <td>{log.action}</td>
//              <td>{new Date(log.date).toLocaleString()}</td>
//            </tr>
//          ))}
//        </tbody>
//      </table>
//      <button onClick={handleSaveToFile}>Save Logs to File</button>
//    </div>
//  );
//}
//
//export default Reports;
