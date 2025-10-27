const express = require('express');
const router = express.Router();
const cricController = require("../controllers/cricControllers");

// Get all players
router.get('/', cricController.getPlayers);

// Add a new player
router.post('/', cricController.addPlayer);

// Get player by ID
router.get('/:id', cricController.getPlayerById);

// Edit player by ID
router.put('/:id', cricController.editPlayer);

// Delete player by ID
router.delete('/:id', cricController.deletePlayer);

module.exports = router;
