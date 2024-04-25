const Outfit = require("../models/outfit");
const Item = require('../models/item');
// const { generateToken } = require("../lib/token");

// Generate an outfit 
// 1. Connect to database, pull a random item from collection items. 

//Function to get a random item name
const create = async (req, res) => {
    try {
        // Aggregate pipeline to fetch a random item name
        const randomItem = await Item.aggregate([
            { $sample: { size: 1 } }, // $sample stage to randomly select one document
            //{ $project: { _id: 0, name: 1 } } // $project stage to include only the "name" field
        ]);

        // Check if a random item was found
        if (randomItem.length === 0) {
            return res.status(404).send({ error: "No items found" });
        }

        const outfitDetails = { 
            top: randomItem[0].name
            //bottom: req.body.bottom, 
            //shoes: req.body.shoes 
            //image: req.body.image 
        };

        const outfit = new Outfit(outfitDetails);
        console.log('newOutfit', Outfit);

        await outfit.save();
        res.status(201).json({ message: `Outfit created, id: ${outfit._id.toString()}`});

    } catch (error) {
        // Handle errors
        res.status(500).send({ error: error.message });
    }
    };
//2. Save the outfit to database collection outfit.


const OutfitsController = {
    create: create,
  };
  
  module.exports = OutfitsController;