const express = require('express');
const router = express.Router();
const Place = require('../models/place');

// Obtener todos los lugares
router.get('/', async (req, res) => {
    try {
        const places = await Place.find();
        res.json(places);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Guardar nuevo lugar
router.post('/', async (req, res) => {
    try {
        const { name, description, lat, lng } = req.body;

        if (!lat || !lng) {
            return res.status(400).json({ message: "Faltan coordenadas" });
        }

        const newPlace = new Place({
            name,
            description,
            location: {
                type: 'Point',
                coordinates: [parseFloat(lng), parseFloat(lat)]
            }
        });

        await newPlace.save();

        res.json({ message: "Lugar guardado correctamente" });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;