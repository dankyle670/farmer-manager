import React, { useState } from 'react';
import './Actions.css';
import { FaPlusCircle, FaEgg, FaFeatherAlt, FaWarehouse } from 'react-icons/fa';
import axios from 'axios';

function Actions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [farmData, setFarmData] = useState({
    name: '',
    location: '',
    area: '',
    chickens: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFarmData({ ...farmData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.REACT_APP_API_URL; // Use environment variable
      const response = await axios.post(`${apiUrl}/farms`, farmData); // Use environment variable
      console.log('Farm Data Saved:', response.data);
      // Handle success, e.g., show a success message, clear form, etc.
    } catch (error) {
      console.error('There was an error saving the farm data!', error);
      // Handle error, e.g., show an error message
    }
    setIsModalOpen(false); // Close the modal after submission
  };

  return (
    <div className="actions-container">
      <h3>Farm Management Actions</h3>
      <div className="actions-buttons">
        <button className="action-button" onClick={() => setIsModalOpen(true)}>
          <FaWarehouse className="action-icon" />
          Create New Farm
        </button>
        <button className="action-button">
          <FaPlusCircle className="action-icon" />
          Add More Chickens
        </button>
        <button className="action-button">
          <FaEgg className="action-icon" />
          Collect Eggs
        </button>
        <button className="action-button">
          <FaFeatherAlt className="action-icon" />
          Clean Coop
        </button>
        <button className="action-button">
          <FaPlusCircle className="action-icon" />
          Feed Chickens
        </button>
        <button className="action-button">
          <FaWarehouse className="action-icon" />
          Check Inventory
        </button>
      </div>

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
                <label>Area (sq. meters)</label>
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
              <button type="submit" className="submit-button">Create Farm</button>
              <button type="button" className="close-button" onClick={() => setIsModalOpen(false)}>Close</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Actions;
