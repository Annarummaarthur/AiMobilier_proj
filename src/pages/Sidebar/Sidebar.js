// Sidebar.js
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  // Fonction pour gérer la déconnexion de l'utilisateur
  const handleLogout = () => {
    // Effacer les informations de connexion dans le stockage local
    localStorage.removeItem('token');
    // Cacher la sidebar en appelant la fonction toggleSidebar fournie par le parent
    toggleSidebar(false);
    // Rediriger vers la page de connexion
    window.location.href = '/'; 
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button onClick={toggleSidebar} className="close-button">
        X
      </button>
      <div className="sidebar-content">
        <ul className="sidebar-menu">
          <li>
            <NavLink to="/liens" onClick={toggleSidebar}>Mes liens</NavLink>
          </li>
          <li>
            <button onClick={handleLogout}>Déconnexion</button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
