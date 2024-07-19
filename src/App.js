import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import Reports from './Reports';
import Tasks from './Tasks';
import Users from './Users';
import Actions from './Actions';
import AuthHandler from './AuthHandler';
import netlifyIdentity from 'netlify-identity-widget';
import Layout from './Layout'; // Import the Layout component
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = netlifyIdentity.currentUser();
    setIsLoggedIn(!!user);

    netlifyIdentity.on('login', (user) => {
      setIsLoggedIn(true);
    });

    netlifyIdentity.on('logout', () => {
      setIsLoggedIn(false);
    });

    return () => {
      netlifyIdentity.off('login');
      netlifyIdentity.off('logout');
    };
  }, []);

  return (
    <Router>
      <AuthHandler setIsLoggedIn={setIsLoggedIn} />
      <div className="App">
        <header className="App-header">
          {isLoggedIn && <button onClick={() => netlifyIdentity.logout()} className="App-button">Logout</button>}
        </header>
        {!isLoggedIn ? (
          <div className="App-buttons">
            <button onClick={() => netlifyIdentity.open('login')} className="App-button">Login</button>
            <button onClick={() => netlifyIdentity.open('signup')} className="App-button">Signup</button>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Layout><Home /></Layout>} />
            <Route path="/reports" element={<Layout><Reports /></Layout>} />
            <Route path="/tasks" element={<Layout><Tasks /></Layout>} />
            <Route path="/users" element={<Layout><Users /></Layout>} />
            <Route path="/actions" element={<Layout><Actions /></Layout>} />
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        )}
        <div id="netlify-modal"></div>
      </div>
    </Router>
  );
}

export default App;
