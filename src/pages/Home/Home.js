import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [countries, setCountries] = useState([]);
  const [scrapedData, setScrapedData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Récupérer les pays depuis l'API Flask
    
    axios.get('http://localhost:5000/api/villes')
      .then(response => {
        setCountries(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des pays:', error);
      });
  }, []);

  const PriceChange = (event) => {
    const value = event.target.value;
    if (!isNaN(value) && value >= 0) {
      setMaxPrice(value);
    }
  };

  const handleCountryChange = (event) => {
    const selectedIndex = event.target.selectedIndex;
    const selectedName = event.target.options[selectedIndex].getAttribute('data-country-name');
    const selectedLink = event.target.value;
    setSelectedCountry([selectedName, selectedLink]);
  };



  const Submit = (event) => {
    event.preventDefault();
    
    setLoading(true);
  
    axios.post('http://localhost:5000/api/scrape', {
      maxPrice,
      country: selectedCountry
    })
      .then((response) => {
        console.log('Réponse des villes:', response.data);
        setScrapedData(response.data);
      })
      .catch((error) => {
        console.error('Erreur lors de la communication avec l\'API Flask:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleClick = async (titre, url, prix, ville) => {
    const user_id = localStorage.getItem('userid');
    try {
      // Envoi des informations d'inscription au serveur
      await axios.post('http://localhost:3001/api/utilisateur/seelink', { user_id, titre, url, prix, ville });
    } catch (error) {
      console.error('Erreur lors de l\'inscription :', error);
      // Affichage d'un message d'erreur à l'utilisateur
    }
    window.open(url, '_blank');
  };

  return (
    <>
      <div className="home">
        <h2>Configurer votre recherche</h2>
        <form onSubmit={Submit}>
          <div>
            <label>Ville : </label>
            <select value={selectedCountry[1]} onChange={handleCountryChange}>
              <option value="" data-country-name="">Sélectionner une ville</option>
              {countries.map((country, index) => (
                <option key={index} value={country.lien} data-country-name={country.nom}>{country.nom}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Prix maximal :</label>
            <input
              type="number"
              value={maxPrice}
              onChange={PriceChange}
              placeholder="Entrez le prix maximal"
            />
          </div>
          <button type="submit">Envoyer</button>
        </form>
      </div>
      <div className="liens">
        <h2>Réponses :</h2>
        {loading ? (
          <p>Chargement en cours...</p>
        ) : (
          <div className="countaner_liens">
            {scrapedData.map((item, index) => (
              <div key={index} className="countaner_lien" onClick={() => handleClick(item.titre, item.lien, item.prix, item.ville)}>
                <a href={item.lien} target="_blank" rel="noopener noreferrer">{item.titre}</a> <br></br>
                <span>
                  Prix : {item.prix} €,
                  Ville : {item.ville}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
