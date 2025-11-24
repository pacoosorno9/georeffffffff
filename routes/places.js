const express = require('express');
const router = express.Router();
const Place = require('../models/place');

router.get(',', async (req, res) => {
    try {
        const places = await Place.find();
        res.json(places);
    } catch(err){
        res.status(500).json({error: err.message});
    }
});

router.post('/', async (req, res) => {
    const {name, description, latitude, longitude} = req.body;
    try{
        const newPlace = new Place({
            name,
            description,
            location: {
                type: 'Point',
                coordinates: [longitude, latitude]
            }
        });
        const saved = await newPlace.save();
        res.json(saved);
    } catch(err){
        res.status(400).json({error: err.message});
    }
});

module.exports = router;