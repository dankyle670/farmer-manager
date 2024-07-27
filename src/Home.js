import React, { useState, useEffect } from 'react';
import './Home.css';
import axios from 'axios';

function Home() {
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    area: '',
    chickens: '',
    spent: 0,
    turnover: 0,
    profit: 0
  });
  const [tasks, setTasks] = useState([]);

  const farmPassword = process.env.REACT_APP_FARM_PASSWORD;

  // Fetch farms from API
  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios.get(`${apiUrl}/api/farms`);
        setFarms(response.data);
      } catch (error) {
        console.error('Error fetching the farm data!', error);
      }
    };

    fetchFarms();
  }, []);

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await axios.get(`${apiUrl}/api/tasks`);
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleEditFarm = (farm) => {
    const password = prompt('Enter the password to edit this farm:');
    if (password === farmPassword) {
      setSelectedFarm(farm);
      setFormData({
        name: farm.name,
        location: farm.location,
        area: farm.area,
        chickens: farm.chickens,
        spent: farm.spent,
        turnover: farm.turnover,
        profit: farm.profit
      });
      setIsModalOpen(true);
    } else {
      alert('Incorrect password. You cannot edit this farm.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const password = prompt('Enter the password to save changes:');
    if (password === farmPassword) {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const updatedFarmData = { ...formData, profit: formData.turnover - formData.spent };
        await axios.put(`${apiUrl}/api/farms/${selectedFarm._id}`, updatedFarmData);
        // Update local state with edited farm
        const updatedFarms = farms.map(farm => (farm._id === selectedFarm._id ? { ...farm, ...updatedFarmData } : farm));
        setFarms(updatedFarms);
        setIsModalOpen(false);
      } catch (error) {
        console.error('Error updating farm:', error);
      }
    } else {
      alert('Incorrect password. Changes were not saved.');
    }
  };

  const handleDeleteClick = async () => {
    const password = prompt('Enter the password to delete this farm:');

    if (password === farmPassword) {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        await axios.delete(`${apiUrl}/api/farms/${selectedFarm._id}`);
        // Update local state to remove the deleted farm
        setFarms(farms.filter(farm => farm._id !== selectedFarm._id));
        setIsModalOpen(false);
      } catch (error) {
        console.error('Error deleting farm:', error);
      }
    } else {
      alert('Incorrect password. The farm was not deleted.');
    }
  };

  return (
    <div className="home-container">
      <h3>Farm Information</h3>
      <div className="farm-list">
        {farms.map((farm, index) => (
          <div key={index} className="farm-item" onClick={() => handleEditFarm(farm)}>
            <h4>{farm.name}</h4>
            <p>Location: {farm.location}</p>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h4>Edit Farm Information</h4>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Farm Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Area (sq. meters)</label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Number of Chickens</label>
                <input
                  type="number"
                  name="chickens"
                  value={formData.chickens}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Spent</label>
                <input
                  type="number"
                  name="spent"
                  value={formData.spent}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Turnover</label>
                <input
                  type="number"
                  name="turnover"
                  value={formData.turnover}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Profit</label>
                <input
                  type="number"
                  name="profit"
                  value={formData.turnover - formData.spent}
                  readOnly
                />
              </div>
              <button type="submit" className="submit-button">Save Changes</button>
              <button type="button" className="close-button" onClick={() => setIsModalOpen(false)}>Close</button>
              <button type="button" className="delete-button" onClick={handleDeleteClick}>Delete</button>
            </form>
          </div>
        </div>
      )}

    <div className="tasks-section">
        <h3>Tasks</h3>
        <div className="tasks-list">
          {tasks.length === 0 ? (
            <p>No tasks available.</p>
          ) : (
            tasks.map((task, index) => (
              <div key={index} className="task-item">
                <p>{task.description}</p>
                <span>{new Date(task.date).toLocaleDateString()}</span>
              </div>
            ))
          )}
        </div>
      </div>
      
    </div>
  );
}

export default Home;
