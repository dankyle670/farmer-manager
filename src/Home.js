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
    chickens: ''
  });

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const response = await axios.get('/api/farms'); // Use relative URL
        setFarms(response.data);
      } catch (error) {
        console.error('Error fetching the farm data!', error);
      }
    };

    fetchFarms();
  }, []);

  const handleEditFarm = (farm) => {
    setSelectedFarm(farm);
    setFormData({
      name: farm.name,
      location: farm.location,
      area: farm.area,
      chickens: farm.chickens
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/farms/${selectedFarm._id}`, formData); // Use relative URL
      // Update local state with edited farm
      const updatedFarms = farms.map(farm => (farm._id === selectedFarm._id ? { ...farm, ...formData } : farm));
      setFarms(updatedFarms);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating farm:', error);
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
              <button type="submit" className="submit-button">Save Changes</button>
              <button type="button" className="close-button" onClick={() => setIsModalOpen(false)}>Close</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;


//import React, { useState, useEffect } from 'react';
//import './Home.css';
//import axios from 'axios';
//
//function Home() {
//  const [farms, setFarms] = useState([]);
//  const [selectedFarm, setSelectedFarm] = useState(null);
//  const [isModalOpen, setIsModalOpen] = useState(false);
//  const [formData, setFormData] = useState({
//    name: '',
//    location: '',
//    area: '',
//    chickens: ''
//  });
//
//  useEffect(() => {
//    const fetchFarms = async () => {
//      try {
//        const response = await axios.get('http://localhost:5000/api/farms');
//        setFarms(response.data);
//      } catch (error) {
//        console.error('There was an error fetching the farm data!', error);
//      }
//    };
//
//    fetchFarms();
//  }, []);
//
//  const handleEditFarm = (farm) => {
//    setSelectedFarm(farm);
//    setFormData({
//      name: farm.name,
//      location: farm.location,
//      area: farm.area,
//      chickens: farm.chickens
//    });
//    setIsModalOpen(true);
//  };
//
//  const handleInputChange = (e) => {
//    const { name, value } = e.target;
//    setFormData({ ...formData, [name]: value });
//  };
//
//  const handleSubmit = async (e) => {
//    e.preventDefault();
//    try {
//      await axios.put(`http://localhost:5000/api/farms/${selectedFarm._id}`, formData);
//      // Update the local farms state with the edited farm
//      const updatedFarms = farms.map(farm => (farm._id === selectedFarm._id ? { ...farm, ...formData } : farm));
//      setFarms(updatedFarms);
//      setIsModalOpen(false);
//    } catch (error) {
//      console.error('Error updating farm:', error);
//    }
//  };
//
//  return (
//    <div className="home-container">
//      <h3>Farm Information</h3>
//      <div className="farm-list">
//        {farms.map((farm, index) => (
//          <div key={index} className="farm-item" onClick={() => handleEditFarm(farm)}>
//            <h4>{farm.name}</h4>
//            <p>Location: {farm.location}</p>
//          </div>
//        ))}
//      </div>
//
//      {isModalOpen && (
//        <div className="modal">
//          <div className="modal-content">
//            <h4>Edit Farm Information</h4>
//            <form onSubmit={handleSubmit}>
//              <div className="form-group">
//                <label>Farm Name</label>
//                <input
//                  type="text"
//                  name="name"
//                  value={formData.name}
//                  onChange={handleInputChange}
//                  required
//                />
//              </div>
//              <div className="form-group">
//                <label>Location</label>
//                <input
//                  type="text"
//                  name="location"
//                  value={formData.location}
//                  onChange={handleInputChange}
//                  required
//                />
//              </div>
//              <div className="form-group">
//                <label>Area (sq. meters)</label>
//                <input
//                  type="number"
//                  name="area"
//                  value={formData.area}
//                  onChange={handleInputChange}
//                  required
//                />
//              </div>
//              <div className="form-group">
//                <label>Number of Chickens</label>
//                <input
//                  type="number"
//                  name="chickens"
//                  value={formData.chickens}
//                  onChange={handleInputChange}
//                  required
//                />
//              </div>
//              <button type="submit" className="submit-button">Save Changes</button>
//              <button type="button" className="close-button" onClick={() => setIsModalOpen(false)}>Close</button>
//            </form>
//          </div>
//        </div>
//      )}
//    </div>
//  );
//}
//
//export default Home;
