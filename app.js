require('dotenv').config();

const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3000;

const place = require('./routes/places');

app.use(cors());
app.use(bodyParser.json());
app.use('/api/places', place);
app.use(express.static('public'));

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Conexión a MongoDB lista');
    app.listen(PORT, () => {
      console.log(`🚀 API en http://localhost:${PORT}`);
      console.log(`📘 Swagger en http://localhost:${PORT}/api-docs`);
    });
  })
  .catch(err => {
    console.error('❌ No se pudo conectar a MongoDB', err);
    process.exit(1);
  });