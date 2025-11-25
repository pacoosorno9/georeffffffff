const express = require('express');
const router = express.Router();
const Place = require('../models/place');

// Obtener lugares
router.get('/', async (req, res) => {
    try {
        const places = await Place.find();
        res.json(places);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crear nuevo lugar
router.post('/', async (req, res) => {
    try {
        const { name, description, lat, lng } = req.body;

        const newPlace = new Place({
            name,
            description,
            location: {
                type: "Point",
                coordinates: [lng, lat]
            }
        });

        await newPlace.save();
        res.json({ message: "Lugar guardado correctamente" });

    } catch(err){
        res.status(400).json({ error: err.message });
    }
});

// Editar lugar
router.put('/:id', async (req, res) => {
    try {
        const { name, description, lat, lng } = req.body;

        // 1. Obtener el registro existente
        const existing = await Place.findById(req.params.id);

        if (!existing) {
            return res.status(404).json({ message: "Lugar no encontrado" });
        }

        // 2. Construir el nuevo registro SOLO con datos enviados
        const updatedPlace = {
            name: name && name.trim() !== "" ? name : existing.name,
            description: description && description.trim() !== "" ? description : existing.description,
            location: {
                type: "Point",
                coordinates: [
                    lng && lng !== "" ? parseFloat(lng) : existing.location.coordinates[0],
                    lat && lat !== "" ? parseFloat(lat) : existing.location.coordinates[1]
                ]
            }
        };

        // 3. Actualizar
        const updated = await Place.findByIdAndUpdate(
            req.params.id,
            updatedPlace,
            { new: true }
        );

        res.json({ message: "Lugar actualizado", updated });

    } catch(err){
        console.error(err);
        res.status(400).json({ error: err.message });
    }
});

// Borrar lugar
router.delete('/:id', async (req, res) => {
    try {
        await Place.findByIdAndDelete(req.params.id);
        res.json({ message: "Lugar eliminado" });
    } catch(err){
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;