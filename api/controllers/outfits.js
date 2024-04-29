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
            randomBottom = bottom[0].name;
        }

        // Find a random pair of "shoes"
        const randomShoes = await Item.aggregate([
            { $match: { category: "shoes" } },
            { $sample: { size: 1 } }
        ]);

        const outfitDetails = { 
            top: randomTopOrDress[0].name,
            bottom: randomBottom,
            shoes: randomShoes[0].name
            //image: this is an advanced feature to place the items as one image
        };

        const outfit = new Outfit(outfitDetails);
        console.log('newOutfit', Outfit);

        await outfit.save();
        res.status(201).json({ outfit });

        } catch (error) {
        res.status(500).send({ error: error.message });
        }
    };

//Generate a random outfit based on occasion and weather

const createByTag = async (req, res) => {
    try {
        //take the info from payload: ["occasion_type", "weather_type"]
        let occasion_type = req.body[0];
        let weather_type = req.body[1];

        const randomTopOrDress = await Item.aggregate([
           { $match: { tags: { $all: [occasion_type, weather_type] } } },
            { $match: { category: { $in: ["top", "dress"] } } },
            { $sample: { size: 1 } }
        ]);

        // Find a random "bottom" if "top" was selected
        let randomBottom = "";
        if (randomTopOrDress[0].category === "top") {
            const bottom = await Item.aggregate([
                { $match: { tags: { $all: [occasion_type, weather_type] } } },
                { $match: { category: "bottom" } },
                { $sample: { size: 1 } }
            ]);
            randomBottom = bottom[0].name;
        }

        // Find a random pair of "shoes"
        const randomShoes = await Item.aggregate([
            { $match: { tags: { $all: [occasion_type, weather_type] } } },
            { $match: { category: "shoes" } },
            { $sample: { size: 1 } }
        ]);

        const outfitDetails = { 
            top: randomTopOrDress[0].name,
            bottom: randomBottom,
            shoes: randomShoes[0].name
            //image: this is an advanced feature to place the items as one image
        };

        const outfit = new Outfit(outfitDetails);
        console.log('newOutfit', Outfit);

        await outfit.save();
        res.status(201).json({ outfit });

        } catch (error) {
        res.status(500).send({ error: error.message });
        }
    };
    

const createManual = async (req, res) => {
    try {
        //unpack the payload data. Expected data: _id of items.  
        top = req.body.top;
        shoes = req.body.shoes;
        if (req.body._id === !null) {
            bottom = req.body._id
        } else { 
            bottom = ""
        }
        
        const outfitDetails = { 
            top: top,
            bottom: bottom,
            shoes: shoes
            //image: req.body.image - this is an advanced feature to place the items as one image
        };
        console.log('top:', top, 'bottom:', bottom, 'shoes', shoes);

        const outfit = new Outfit(outfitDetails);
        console.log('newOutfit', outfit);

        await outfit.save();
        res.status(201).json({ outfit });

        } catch (error) {
        res.status(500).send({ error: error.message });
        }
    };

//Update Favourite field from false (default) to true

const updateFav = async (req, res) => {
    try {
        //find document by outfit ID sent through the payload 
        objectId = req.body._id;

        const updatedOutfit = await Outfit.findOneAndUpdate(
            { _id: objectId },
            { favourite: true }, // Set favourite to true
            { new: true } // Return the updated document
        );

        if (!updatedOutfit) {
            return res.status(404).json({ error: "Item not found" });
        }

        res.status(200).json({ message: "Outfit favourite status updated", updatedOutfit });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// get all favourite outfits
const getFavourites = async (req, res) => {
    try {
        const favoriteOutfits = await Outfit.find({ favourite: true });
        res.status(200).json({ outfits: favoriteOutfits });
     } catch (error) {
        res.status(500).json({ error: error.message });
  }
};

const OutfitsController = {
    create: create,
    createManual: createManual,
    createByTag: createByTag,
    getFavourites: getFavourites,
    updateFav: updateFav
  };
  
  module.exports = OutfitsController;