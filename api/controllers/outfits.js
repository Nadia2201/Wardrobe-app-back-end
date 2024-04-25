const Outfit = require("../models/outfit");
const Item = require('../models/item');
// const { generateToken } = require("../lib/token");

// Generate a random outfit: pull items from 'items' collection randomly, save it in 'outfit' collection.  

const create = async (req, res) => {
    try {
        const randomTopOrDress = await Item.aggregate([
            { $match: { category: { $in: ["top", "dress"] } } },
            { $sample: { size: 1 } }
        ]);

        // Find a random "bottom" if "top" was selected
        let randomBottom = "";
        if (randomTopOrDress[0].category === "top") {
            const bottom = await Item.aggregate([
                { $match: { category: "bottom" } },
                { $sample: { size: 1 } }
            ]);
            randomBottom = bottom[0]._id;
        }

        // Find a random pair of "shoes"
        const randomShoes = await Item.aggregate([
            { $match: { category: "shoes" } },
            { $sample: { size: 1 } }
        ]);

        const outfitDetails = { 
            top: randomTopOrDress[0]._id,
            bottom: randomBottom,
            shoes: randomShoes[0]._id
            //image: req.body.image - this is an advanced feature to place the items as one image
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
    
const OutfitsController = {
    create: create,
  };
  
  module.exports = OutfitsController;