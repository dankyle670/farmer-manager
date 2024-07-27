import React, { useState } from 'react';
import './Users.css';

function Users() {
  const [location, setLocation] = useState(null);

  const handleShareLocation = () => {
    if (window.confirm('Are you sure you want to share your location?')) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.error('Error getting location:', error);
            alert('Error getting location: ' + error.message);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          }
        );
      } else {
        alert('Geolocation is not supported by this browser.');
      }
    }
  };

  return (
    <div className="users-container">
      <h3>Users</h3>
      <button onClick={handleShareLocation}>Share My Location</button>

      {location && (
        <div className="location-info">
          <h4>Your Location</h4>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
        </div>
      )}
    </div>
  );
}

export default Users;
