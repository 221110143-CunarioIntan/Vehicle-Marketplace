const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');

router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll();
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Contoh POST untuk tambah kendaraan
router.post('/', async (req, res) => {
  try {
    const { model, year, price, location, description } = req.body;
    const vehicle = await Vehicle.create({ brand, model, year, price, location, description });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;