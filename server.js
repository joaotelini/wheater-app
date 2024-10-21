require('dotenv').config();
const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)); // Suporte a ES Modules

const app = express();

// Serve arquivos estáticos da pasta 'assets' e outros arquivos como 'index.html'
app.use(express.static(__dirname)); // Serve todos os arquivos da raiz do projeto

app.get('/weather/:city', async (req, res) => {
  const city = req.params.city;
  const url = `https://api.weatherapi.com/v1/current.json?key=${process.env.API_KEY}&q=${city}&lang=pt`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).send('Erro ao buscar dados do clima');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
