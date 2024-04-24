const Outfit = require("../models/outfit");
// const Item = require('../models/item');
// const { generateToken } = require("../lib/token");

// Generate an outfit 
// 1. Connect to database, pull a random item from collection items. 

const create = async (req, res) => {
    try {
        const outfitDetails = { 
            top: req.body.top, 
            bottom: req.body.bottom, 
            shoes: req.body.shoes 
            //image: req.body.image 
        };

        const item = new Outfit(outfitDetails);
        console.log('newOutfit', Outfit);

        await item.save();
        res.status(201).json({ message: `Outfit created, id: ${item._id.toString()}`});
    } 
    catch (error) {
        res.status(400).json({ message: `This went wrong: ${error.message}` });
    }
};


// Function to get a random item name
// const create = async (req, res) => {
//     try {
//         // Aggregate pipeline to fetch a random item name
//         const randomItem = await Item.aggregate([
//             { $sample: { size: 1 } }, // $sample stage to randomly select one document
//             { $project: { _id: 0, name: 1 } } // $project stage to include only the "name" field
//         ]);

//         // Check if a random item was found
//         if (randomItem.length === 0) {
//             return res.status(404).send({ error: "No items found" });
//         }

//         // Return the name of the random item
//         res.send(randomItem[0].name);
//     } catch (error) {
//         // Handle errors
//         res.status(500).send({ error: error.message });
//     }
// };
// 2. Save the outfit to database collection outfit.

const OutfitController = {
    create: create,
  };
  
  module.exports = OutfitController;