// const Outfit = require("../models/outfit");
// const Item = require("../controllers/items")
// const { generateToken } = require("../lib/token");

// Generate an outfit 
// 1. Connect to database, pull a random item from collection items. 

console.log("5")

// Import the Item model
const Item = require('../models/item');

// Function to get a random item name
exports.create = async (req, res) => {
    try {
        // Aggregate pipeline to fetch a random item name
        const randomItem = await Item.aggregate([
            { $sample: { size: 1 } }, // $sample stage to randomly select one document
            { $project: { _id: 0, name: 1 } } // $project stage to include only the "name" field
        ]);

        // Check if a random item was found
        if (randomItem.length === 0) {
            return res.status(404).send({ error: "No items found" });
        }

        // Return the name of the random item
        res.send(randomItem[0].name);
    } catch (error) {
        // Handle errors
        res.status(500).send({ error: error.message });
    }
};
// 2. Save the outfit to database collection outfit.

