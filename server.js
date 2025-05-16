const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Statikus fájlok kiszolgálása (pl. CSS, JS, képek a "public" mappából)
app.use(express.static('public'));

// Főoldal
app.get('/', (req, res) => {
    res.send("Működik a backend 😎");
});

// Felhasználók megjelenítése
app.get('/users', async (req, res) => {
    try {
        // Külső API hívás a felhasználói adatok lekéréséhez
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        const users = response.data;

        // HTML oldal létrehozása a felhasználók listájával
        let html = `
        <!DOCTYPE html>
        <html lang="hu">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Felhasználók</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f2f2f2;
                    padding: 20px;
                }
                h1 {
                    color: #2c3e50;
                }
                .user {
                    background-color: #fff;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 20px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .user h2 {
                    margin: 0 0 10px;
                    color: #34495e;
                }
                .user p {
                    margin: 4px 0;
                }
                .address, .company {
                    margin-top: 10px;
                    padding-left: 15px;
                    color: #555;
                }
                .address h3, .company h3 {
                    margin-bottom: 5px;
                    color: #666;
                }
                a {
                    color: #2980b9;
                    text-decoration: none;
                }
                a:hover {
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <h1>Felhasználók listája</h1>
        `;

        for (const user of users) {
            html += `
            <div class="user">
                <h2>${user.name}</h2>
                <p><strong>Felhasználónév:</strong> ${user.username}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Telefonszám:</strong> ${user.phone}</p>
                <p><strong>Weboldal:</strong> <a href="http://${user.website}" target="_blank">${user.website}</a></p>

                <div class="address">
                    <h3>Cím</h3>
                    <p>${user.address.street}, ${user.address.suite}</p>
                    <p>${user.address.city}, ${user.address.zipcode}</p>
                    <p><strong>Koordináták:</strong> ${user.address.geo.lat}, ${user.address.geo.lng}</p>
                </div>

                <div class="company">
                    <h3>Cég</h3>
                    <p><strong>Név:</strong> ${user.company.name}</p>
                    <p><strong>Mottó:</strong> ${user.company.catchPhrase}</p>
                    <p><strong>Tevékenység:</strong> ${user.company.bs}</p>
                </div>
            </div>
            `;
        }

        html += `
        </body>
        </html>
        `;

        // HTML válasz elküldése a böngészőnek
        res.send(html);
    } catch (error) {
        // Hiba esetén 500-as státuszkód és hibaüzenet
        console.error('Hiba történt:', error.message);
        res.status(500).send('Nem sikerült lekérni az adatokat.');
    }
});

// Szerver indítása a megadott porton
app.listen(port, () => {
    console.log(`A szerver fut a http://localhost:${port} címen`);
});
