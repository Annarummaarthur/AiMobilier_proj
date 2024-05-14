import React, { useState, useEffect } from 'react';
import './Liens.css';
import axios from 'axios';

const Liens = () => {
  const [liens, setLiens] = useState([]);
  const [linksLoading, setLinksLoading] = useState(true);

  useEffect(() => {
    fetchLiens();
  }, []);

  const fetchLiens = async () => {
    try {
      const user_id = localStorage.getItem('userid');
      const response = await axios.get(`http://localhost:3001/api/utilisateur/getlink?user_id=${user_id}`);
      setLiens(response.data);
      setLinksLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des liens :', error);
      setLinksLoading(false);
    } 
  };
  

  const handleClick = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="liens">
      <h2>Liens visités :</h2>
      {linksLoading ? (
        <p>Chargement en cours...</p>
      ) : (
        <div className="container_liens">
          {liens.length === 0 ? (
            <p>Aucun lien trouvé.</p>
          ) : (
            liens.map(({ titre, url, prix, ville }, index) => (
              <div key={index} className="container_lien" onClick={() => handleClick(url)}>
                <a href={url} target="_blank" rel="noopener noreferrer">{titre}</a> <br />
                <span>
                  Prix : {prix} €,
                  Ville : {ville}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Liens;
