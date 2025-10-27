
const { Op } = require("sequelize"); // ✅ Required for 'Op.like'
const Cricketer = require("../models/cric");



// ✅ Create Player
const addPlayer = async (req, res) => {
  try {
    const newCricketer = await Cricketer.create(req.body);
    res.status(201).json(newCricketer);
  } catch (error) {
    res.status(400).json({ message: "Error creating profile", error: error.message });
  }
};

// ✅ Get All Players (with optional name search)
const getPlayers = async (req, res) => {
  try {
    const { name } = req.query;
    const options = {};

    if (name) {
      options.where = {
        name: {
          [Op.like]: `%${name}%`
        }
      };
    }

    const cricketers = await Cricketer.findAll(options);
    res.json(cricketers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error: error.message });
  }
};

// ✅ Get Player by ID
const getPlayerById = async (req, res) => {
  try {
    const id = req.params.id;
    const cricketer = await Cricketer.findByPk(id);

    if (cricketer) {
      res.json(cricketer);
    } else {
      res.status(404).json({ message: `Cricketer with ID ${id} not found.` });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error: error.message });
  }
};

// ✅ Update Player
const editPlayer = async (req, res) => {
  try {
    const id = req.params.id;
    const cricketer = await Cricketer.findByPk(id);

    if (!cricketer) {
      return res.status(404).json({ message: `Cricketer with ID ${id} not found.` });
    }

    const updatedCricketer = await cricketer.update(req.body);
    res.json(updatedCricketer);
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};

// ✅ Delete Player
const deletePlayer = async (req, res) => {
  try {
    const id = req.params.id;
    const cricketer = await Cricketer.findByPk(id);

    if (!cricketer) {
      // 🧩 Fix: 4404 → 404
      return res.status(404).json({ message: `Cricketer with ID ${id} not found.` });
    }

    await cricketer.destroy();
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ message: "Error deleting profile", error: error.message });
  }
};

module.exports = {
  addPlayer,
  getPlayers,
  getPlayerById,
  editPlayer,
  deletePlayer
};
