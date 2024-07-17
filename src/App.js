import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import netlifyIdentity from 'netlify-identity-widget';

function App() {
  useEffect(() => {
    const initNetlifyIdentity = () => {
      netlifyIdentity.init({
        container: '#netlify-modal', // Ensure this element exists in your HTML
        locale: 'en', // Optional: Specify the locale
      });

      netlifyIdentity.on('init', (user) => {
        console.log('Netlify Identity user:', user);
      });

      netlifyIdentity.on('login', (user) => {
        console.log('Logged in user:', user);
        // Redirect or handle login success
        window.location.href = '/servicesPrice'; // Example redirection
      });

      // Event listeners for signup and login buttons
      const signupButton = document.getElementById('signup-button');
      const loginButton = document.getElementById('login-button');

      if (signupButton) {
        signupButton.addEventListener('click', (event) => {
          event.preventDefault();
          netlifyIdentity.open('signup');
        });
      }

      if (loginButton) {
        loginButton.addEventListener('click', (event) => {
          event.preventDefault();
          netlifyIdentity.open('login');
        });
      }
    };

    initNetlifyIdentity();

    // Cleanup function
    return () => {
      netlifyIdentity.off('login');
      netlifyIdentity.off('init');
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          {/* Header content if needed */}
        </header>
        <div className="App-buttons">
          <button id="login-button" className="App-button">Login</button>
          <button id="signup-button" className="App-button">Signup</button>
        </div>
        <Routes>
          {/* Define your routes here */}
        </Routes>
        <div id="netlify-modal"></div>
      </div>
    </Router>
  );
}

export default App;
