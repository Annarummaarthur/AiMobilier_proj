import React, { useState, useEffect } from 'react';
import './Header.css';
import logo from '../../image/AIMobilierblanc.png';
import Sidebar from '../Sidebar/Sidebar';
import sidebarIcon from '../../image/3401904-200.png';

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fonction pour vérifier si l'utilisateur est connecté
  const checkLoggedIn = () => {
    const loggedInStatus = localStorage.getItem('token');
    setIsLoggedIn(!!loggedInStatus); // Convertir en booléen
  };

  useEffect(() => {
    checkLoggedIn();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <header>
        <div className="logo-container">
          <a href="/">
            <img src={logo} alt="Logo" className="logo" />
          </a>
        </div>
        <h1>AI MOBILIER</h1>
        {isLoggedIn && (
          <img
            src={sidebarIcon}
            alt="Sidebar Icon"
            className="sidebar-toggle-button"
            onClick={toggleSidebar}
          />
        )}
        {isLoggedIn && <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}
      </header>
    </>
  );
};

export default Header;
