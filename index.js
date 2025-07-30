const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Početna ruta
app.get('/', (req, res) => {
  res.send('banana');
});

// Ruta /zdravo
app.get('/zdravo', (req, res) => {
  res.send('Zdravo, Mladen!');
});

// Ruta /kontakt
app.get('/kontakt', (req, res) => {
  res.send('Kontakt stranica');
});

// Pokretanje servera
app.listen(port, () => {
  console.log(`Server radi na portu ${port}`);
});
