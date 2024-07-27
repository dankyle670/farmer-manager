import React, { useState, useEffect } from 'react';
import './Actions.css';
import { FaPlusCircle, FaEgg, FaFeatherAlt, FaWarehouse, FaDollarSign } from 'react-icons/fa';
import axios from 'axios';
import netlifyIdentity from 'netlify-identity-widget';

function Actions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isFinancialsModalOpen, setIsFinancialsModalOpen] = useState(false);
  const [selectedFarmId, setSelectedFarmId] = useState('');
  const [password, setPassword] = useState('');

  const [farmData, setFarmData] = useState({
    name: '',
    location: '',
    area: '',
    chickens: ''
  });

  const [financialsData, setFinancialsData] = useState({
    spent: '',
    earnings: '',
    spent_com: '',
    earnings_com: '',
    profit: 0,
    turnover: 0
  });

  const [farms, setFarms] = useState([]);
  const presetPassword = process.env.REACT_APP_FARM_PASSWORD;


  useEffect(() => {
    netlifyIdentity.init();
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.get(`${apiUrl}/api/farms`);
      setFarms(response.data);
    } catch (error) {
      console.error('Error fetching farms:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFarmData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFinancialsInputChange = (e) => {
    const { name, value } = e.target;
    if (name && value !== undefined) {
      setFinancialsData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === presetPassword) {
      setIsPasswordModalOpen(false);
      setIsModalOpen(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleFinancialsSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFarmId) {
        alert('Please select a farm');
        return;
  }

  // Validate the input values
  const spent = parseFloat(financialsData.spent);
  const earnings = parseFloat(financialsData.earnings);
  const spent_com = financialsData.spent_com;
  const earnings_com = financialsData.earnings_com;

  if (isNaN(spent) || isNaN(earnings) || !spent_com || !earnings_com) {
      alert('Spent, earnings, spent_com, and earnings_com are required and must be valid.');
      return;
  }

  // Log the data being sent to the server for debugging
  console.log('Submitting financial data:', {
      spent,
      earnings,
      spent_com,
      earnings_com,
      user: 'YourUserIdentifier' // Replace with actual user identifier if available
  });

  try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.put(`${apiUrl}/api/farms/${selectedFarmId}/financials`, {
          spent,
          earnings,
          spent_com,
          earnings_com,
          user: 'YourUserIdentifier' // Replace with actual user identifier if available
      });
      console.log('Financial Data Updated:', response.data);
      setFinancialsData({
          ...financialsData,
          profit: response.data.profit,
          turnover: response.data.turnover
      });
      logAction('Manage Financials');
  } catch (error) {
      console.error('Error updating financial data:', error.response ? error.response.data : error.message);
  }
  setIsFinancialsModalOpen(false);
};

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const apiUrl = process.env.REACT_APP_API_URL;
    const response = await axios.post(`${apiUrl}/api/farms`, farmData);
    console.log('Farm Data Saved:', response.data);
    logAction('Create New Farm');
  } catch (error) {
    console.error('There was an error saving the farm data!', error);
  }
  setIsModalOpen(false);
};

const logAction = async (actionDescription) => {
  const currentUser = netlifyIdentity.currentUser();
  if (!currentUser) {
    console.error('No user logged in');
    return;
  }
  const logData = {
    user: currentUser.user_metadata.full_name || currentUser.email,
    ip: await fetch('https://api.ipify.org?format=json').then(res => res.json()).then(data => data.ip),
    action: actionDescription
  };
  try {
    const apiUrl = process.env.REACT_APP_API_URL;
    await axios.post(`${apiUrl}/api/logs`, logData);
  } catch (error) {
    console.error('Error logging action:', error);
  }
};

  return (
    <div className="actions-container">
      <h3>Farm Management Actions</h3>
      <div className="actions-buttons">
        <button className="action-button" onClick={() => setIsPasswordModalOpen(true)}>
          <FaWarehouse className="action-icon" />
          Create New Farm
        </button>
        <button className="action-button" onClick={() => logAction('Add More Chickens')}>
          <FaPlusCircle className="action-icon" />
          Add More Chickens
        </button>
        <button className="action-button" onClick={() => logAction('Collect Eggs')}>
          <FaEgg className="action-icon" />
          Collect Eggs
        </button>
        <button className="action-button" onClick={() => logAction('Clean Coop')}>
          <FaFeatherAlt className="action-icon" />
          Clean Coop
        </button>
        <button className="action-button" onClick={() => logAction('Feed Chickens')}>
          <FaPlusCircle className="action-icon" />
          Feed Chickens
        </button>
        <button className="action-button" onClick={() => logAction('Check Inventory')}>
          <FaWarehouse className="action-icon" />
          Check Inventory
        </button>
        <button className="action-button" onClick={() => setIsFinancialsModalOpen(true)}>
          <FaDollarSign className="action-icon" />
          Manage Spent and Turnover
        </button>
      </div>

      {isPasswordModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h4>Enter Password</h4>
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <button type="submit" className="submit-button">Submit</button>
              <button type="button" className="close-button" onClick={() => setIsPasswordModalOpen(false)}>Close</button>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h4>Create New Farm</h4>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Farm Name</label>
                <input
                  type="text"
                  name="name"
                  value={farmData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={farmData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Area (in acres)</label>
                <input
                  type="number"
                  name="area"
                  value={farmData.area}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Number of Chickens</label>
                <input
                  type="number"
                  name="chickens"
                  value={farmData.chickens}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit" className="submit-button">Create</button>
              <button type="button" className="close-button" onClick={() => setIsModalOpen(false)}>Close</button>
            </form>
          </div>
        </div>
      )}

      {isFinancialsModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h4>Manage Spent and Earnings</h4>
            <form onSubmit={handleFinancialsSubmit}>
              <div className="form-group">
                <label>Select Farm</label>
                <select
                  value={selectedFarmId}
                  onChange={(e) => setSelectedFarmId(e.target.value)}
                  required
                >
                  <option value="">Select a farm</option>
                  {farms.map(farm => (
                    <option key={farm._id} value={farm._id}>{farm.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Spent</label>
                <input
                  type="number"
                  name="spent"
                  value={financialsData.spent}
                  onChange={handleFinancialsInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Spent Comment</label>
                <textarea
                  name="spent_com"
                  value={financialsData.spent_com}
                  onChange={handleFinancialsInputChange}
                />
              </div>
              <div className="form-group">
                <label>Earnings</label>
                <input
                  type="number"
                  name="earnings"
                  value={financialsData.earnings}
                  onChange={handleFinancialsInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Earnings Comment</label>
                <textarea
                  name="earnings_com"
                  value={financialsData.earnings_com}
                  onChange={handleFinancialsInputChange}
                />
              </div>
              <button type="submit" className="submit-button">Update Financials</button>
              <button type="button" className="close-button" onClick={() => setIsFinancialsModalOpen(false)}>Close</button>
            </form>
            {financialsData.profit !== 0 && (
              <div className="financials-summary">
                <h4>Financial Summary</h4>
                <p>Profit: ${financialsData.profit.toFixed(2)}</p>
                <p>Turnover: ${financialsData.turnover.toFixed(2)}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Actions;
