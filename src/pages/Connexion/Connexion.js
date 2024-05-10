// Connexion.js
import React from 'react';
import './Connexion.css';
import axios from 'axios';

const Connexion = () => {
  const [showLogin, setShowLogin] = React.useState(true);

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    try {
      // Envoi des informations de connexion au serveur pour vérification
      const response = await axios.post('http://localhost:3001/api/utilisateur/connexion', { email, password });
      // Stockage du token JWT dans le stockage local
      localStorage.setItem('token', response.data);
      localStorage.setItem('userid', response.data.id);
      // Redirection vers la page d'accueil
      window.location.href = '/home'; 
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      // Affichage d'un message d'erreur à l'utilisateur
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const nom = formData.get('username');
    const password = formData.get('password');
    const adresse = formData.get('address');
    const email = formData.get('email');
    const telephone = formData.get('telephone');
    try {
      // Envoi des informations d'inscription au serveur
      await axios.post('http://localhost:3001/api/utilisateur', { nom, password, adresse, email, telephone });
      console.log('Utilisateur inséré avec succès !');
      // Redirection vers la page de connexion après inscription
      window.location.href = '/'; 
    } catch (error) {
      console.error('Erreur lors de l\'inscription :', error);
      // Affichage d'un message d'erreur à l'utilisateur
    }
  };

  React.useEffect(() => {
    // Vérifier si l'utilisateur est connecté lors du chargement de la page
    const token = localStorage.getItem('token');
    if (token) {
      // Rediriger vers la page d'accueil si l'utilisateur est connecté
      window.location.href = '/home';
    }
  }, []);

  // Fonction pour empêcher le copier-coller dans les zones de saisie
  const handlePaste = (event) => {
    event.preventDefault();
  };

  return (
    <div className={`home ${showLogin ? '' : 'flipped'}`}>
      <h2 className={showLogin ? '' : 'inscription'}>
        {showLogin ? 'Connexion' : 'Inscription'}
      </h2>
      <div className="form-container">
        {showLogin ? (
          <div className="login-form">
            <form onSubmit={handleLogin}>
              <label htmlFor="email">Email :</label>
              <input type="email" id="email" name="email" required onPaste={handlePaste} />
              <label htmlFor="password">Mot de passe :</label>
              <input type="password" id="password" name="password" required onPaste={handlePaste} />
              <button type="submit">Se connecter</button>
            </form>
            <button onClick={toggleForm}>Je suis nouveau</button>
          </div>
        ) : (
          <div className="inscription-form">
            <form onSubmit={handleSignup}>
              <label htmlFor="username">Nom d'utilisateur:</label>
              <input type="text" id="username" name="username" required onPaste={handlePaste} />
              <label htmlFor="password">Mot de passe:</label>
              <input type="password" id="password" name="password" required onPaste={handlePaste} />
              <label htmlFor="address">Adresse:</label>
              <input type="text" id="address" name="address" onPaste={handlePaste} />
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" onPaste={handlePaste} />
              <label htmlFor="telephone">Téléphone:</label>
              <input type="tel" id="telephone" name="telephone" onPaste={handlePaste} />
              <button type="submit">S'inscrire</button>
            </form>
            <button onClick={toggleForm}>Je suis déjà inscrit</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Connexion;
