// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/Home/Home';
import Header from './pages/Header/Header';
import Connexion from './pages/Connexion/Connexion';
import Liens from './pages/Liens/Liens';
import './App.css';

function App() {
  const isLoggedIn = localStorage.getItem('token');

  // Fonction pour vérifier si l'utilisateur est connecté
  const checkLoggedIn = () => {
    return !!isLoggedIn; // Convertir en booléen
  };

  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route exact path="/" element={<Connexion />} />
          <Route
            exact
            path="/home"
            element={checkLoggedIn() ? <Home /> : <Navigate to="/" />}
          />
          <Route
            exact
            path="/liens"
            element={checkLoggedIn() ? <Liens /> : <Navigate to="/" />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
