import React from 'react';
import Sidebar from './Sidebar';
import './Layout.css';

function Layout({ children }) {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
}

export default Layout;
