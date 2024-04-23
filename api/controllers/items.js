const Item = require('../models/item');

// Function to create a new item
exports.createItem = async (req, res) => {
    try {
        const { name, category, tags, image } = req.body;
        const newItem = new Item({ name, category, tags, image });

        await newItem.save();
        res.status(201).send(newItem);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Function to get an item by ID
exports.getItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        res.send(item);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};


