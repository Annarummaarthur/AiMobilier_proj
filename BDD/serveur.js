const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createPool } = require('mysql');
const bcrypt = require('bcrypt');

const pool = createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "aimobilier"
});

const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000',
}));

app.post('/api/utilisateur', async (req, res) => {
    const { nom, password, adresse = "", email = "", telephone = "" } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const insertionQuery = `INSERT INTO utilisateur (nom, password, adresse, email, telephone) VALUES (?, ?, ?, ?, ?)`;
        pool.query(insertionQuery, [nom, hashedPassword, adresse, email, telephone], function(err, result) {
            if (err) {
                console.log(err);
                return res.status(500).send('Erreur lors de l\'insertion de l\'utilisateur');
            }
            return res.status(200).send('Utilisateur inséré avec succès');
        });
    } catch (error) {
        console.error('Erreur lors du hashage du mot de passe:', error);
        return res.status(500).send('Erreur lors de l\'inscription de l\'utilisateur');
    }
});

app.post('/api/utilisateur/connexion', async (req, res) => {
    const { email, password } = req.body;
    const selectQuery = `SELECT * FROM utilisateur WHERE email = ?`;
    pool.query(selectQuery, [email], async function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result.length === 0) {
            return res.status(401).send('Email ou mot de passe incorrect');
        }
        const user = result[0];
        try {
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                return res.status(200).json(user);
            } else {
                return res.status(401).send('Email ou mot de passe incorrect');
            }
        } catch (error) {
            console.error('Erreur lors de la comparaison des mots de passe:', error);
            return res.status(500).send('Erreur lors de la vérification des informations de connexion');
        }
    });
});

app.post('/api/utilisateur/seelink', async (req, res) => {
    const { user_id, titre, url, prix, ville} = req.body;
    try {
        const insertionQuery = `INSERT INTO links (user_id, titre, url, prix, ville) VALUES (?, ?, ?, ?, ?)`;
        pool.query(insertionQuery, [user_id, titre, url, prix, ville], function(err, result) {
            if (err) {
                console.log(err);
                return res.status(500).send('Erreur lors de l\'insertion du lien');
            }
            return res.status(200).send('lien inséré avec succès');
        });
    } catch (error) {
        return res.status(500).send('Erreur lors du lien');
    }
});

app.get('/api/utilisateur/getlink', async (req, res) => {
    const user_id = req.query.user_id; // Récupérer user_id depuis les paramètres de la requête
    console.log(user_id)
    const selectQuery = `SELECT * FROM links WHERE user_id = ?`; // Utiliser user_id dans la requête SQL si nécessaire
    pool.query(selectQuery, [user_id], function(err, result) {
        if (err) {
            console.log(err);
            return res.status(500).send('Erreur lors de la récupération des liens');
        }
        return res.status(200).json(result);
    });
});








app.listen(3001, () => {
    console.log('Serveur en écoute sur le port 3001');
});
