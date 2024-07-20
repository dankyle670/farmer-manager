import React, { useState, useEffect } from 'react';
import './Actions.css';
import { FaPlusCircle, FaEgg, FaFeatherAlt, FaWarehouse } from 'react-icons/fa';
import axios from 'axios';
import netlifyIdentity from 'netlify-identity-widget';

function Actions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [farmData, setFarmData] = useState({
    name: '',
    location: '',
    area: '',
    chickens: ''
  });

  useEffect(() => {
    netlifyIdentity.init();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFarmData({ ...farmData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const presetPassword = 'your-password'; // Replace with your actual password
    if (password === presetPassword) {
      setIsPasswordModalOpen(false);
      setIsModalOpen(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.post(`${apiUrl}/api/farms`, farmData); // Adjusted path
      console.log('Farm Data Saved:', response.data);
      logAction('Create New Farm');
      // Handle success, e.g., show a success message, clear form, etc.
    } catch (error) {
      console.error('There was an error saving the farm data!', error);
      // Handle error, e.g., show an error message
    }
    setIsModalOpen(false); // Close the modal after submission
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
        <button className="action-button" onClick={() => { setIsPasswordModalOpen(true); }}>
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
    </div>
  );
}

export default Actions;



//import React, { useState } from 'react';
//import './Actions.css';
//import { FaPlusCircle, FaEgg, FaFeatherAlt, FaWarehouse } from 'react-icons/fa';
//import axios from 'axios';
//
//function Actions() {
//  const [isModalOpen, setIsModalOpen] = useState(false);
//  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
//  const [password, setPassword] = useState('');
//  const [farmData, setFarmData] = useState({
//    name: '',
//    location: '',
//    area: '',
//    chickens: ''
//  });
//
//  const farmPassword = process.env.REACT_APP_FARM_PASSWORD;
//
//  const handleInputChange = (e) => {
//    const { name, value } = e.target;
//    setFarmData({ ...farmData, [name]: value });
//  };
//
//  const handlePasswordChange = (e) => {
//    setPassword(e.target.value);
//  };
//
//  const handlePasswordSubmit = (e) => {
//    e.preventDefault();
//    if (password === farmPassword) {
//      setIsPasswordModalOpen(false);
//      setIsModalOpen(true);
//    } else {
//      alert('Incorrect password');
//    }
//  };
//
//  const handleSubmit = async (e) => {
//    e.preventDefault();
//    try {
//      const apiUrl = process.env.REACT_APP_API_URL;
//      const response = await axios.post(`${apiUrl}/api/farms`, farmData); // Adjusted path
//      console.log('Farm Data Saved:', response.data);
//      // Handle success, e.g., show a success message, clear form, etc.
//    } catch (error) {
//      console.error('There was an error saving the farm data!', error);
//      // Handle error, e.g., show an error message
//    }
//    setIsModalOpen(false); // Close the modal after submission
//  };
//
//  return (
//    <div className="actions-container">
//      <h3>Farm Management Actions</h3>
//      <div className="actions-buttons">
//        <button className="action-button" onClick={() => setIsPasswordModalOpen(true)}>
//          <FaWarehouse className="action-icon" />
//          Create New Farm
//        </button>
//        <button className="action-button">
//          <FaPlusCircle className="action-icon" />
//          Add More Chickens
//        </button>
//        <button className="action-button">
//          <FaEgg className="action-icon" />
//          Collect Eggs
//        </button>
//        <button className="action-button">
//          <FaFeatherAlt className="action-icon" />
//          Clean Coop
//        </button>
//        <button className="action-button">
//          <FaPlusCircle className="action-icon" />
//          Feed Chickens
//        </button>
//        <button className="action-button">
//          <FaWarehouse className="action-icon" />
//          Check Inventory
//        </button>
//      </div>
//
//      {isPasswordModalOpen && (
//        <div className="modal">
//          <div className="modal-content">
//            <h4>Enter Password</h4>
//            <form onSubmit={handlePasswordSubmit}>
//              <div className="form-group">
//                <label>Password</label>
//                <input
//                  type="password"
//                  value={password}
//                  onChange={handlePasswordChange}
//                  required
//                />
//              </div>
//              <button type="submit" className="submit-button">Submit</button>
//              <button type="button" className="close-button" onClick={() => setIsPasswordModalOpen(false)}>Close</button>
//            </form>
//          </div>
//        </div>
//      )}
//
//      {isModalOpen && (
//        <div className="modal">
//          <div className="modal-content">
//            <h4>Create New Farm</h4>
//            <form onSubmit={handleSubmit}>
//              <div className="form-group">
//                <label>Farm Name</label>
//                <input
//                  type="text"
//                  name="name"
//                  value={farmData.name}
//                  onChange={handleInputChange}
//                  required
//                />
//              </div>
//              <div className="form-group">
//                <label>Location</label>
//                <input
//                  type="text"
//                  name="location"
//                  value={farmData.location}
//                  onChange={handleInputChange}
//                  required
//                />
//              </div>
//              <div className="form-group">
//                <label>Area (sq. meters)</label>
//                <input
//                  type="number"
//                  name="area"
//                  value={farmData.area}
//                  onChange={handleInputChange}
//                  required
//                />
//              </div>
//              <div className="form-group">
//                <label>Number of Chickens</label>
//                <input
//                  type="number"
//                  name="chickens"
//                  value={farmData.chickens}
//                  onChange={handleInputChange}
//                  required
//                />
//              </div>
//              <button type="submit" className="submit-button">Create Farm</button>
//              <button type="button" className="close-button" onClick={() => setIsModalOpen(false)}>Close</button>
//            </form>
//          </div>
//        </div>
//      )}
//    </div>
//  );
//}
//
//export default Actions;
