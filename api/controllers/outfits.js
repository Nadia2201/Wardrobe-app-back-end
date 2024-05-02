const Outfit = require("../models/outfit");
const Item = require('../models/item');
const { getUserIdFromToken } = require("../middleware/tokenChecker")
// const { generateToken } = require("../lib/token");

// Generate a random outfit: pull items from 'items' collection randomly, save it in 'outfit' collection.  

const create = async (req, res) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    const userId = getUserIdFromToken(token);
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
            shoes: randomShoes[0]._id,
            userId: userId
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
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    const userId = getUserIdFromToken(token);
    try {
        //take the info from payload: ["occasion_type", "weather_type"]
        let occasion_type = req.body.occasion;
        let weather_type = req.body.weather;

        console.log(occasion_type, weather_type)

        const randomTopOrDress = await Item.aggregate([
            {
                $match: {
                    $and: [
                        { tags: { $all: [occasion_type, weather_type] } }, // Match all specified tags
                        { category: { $in: ["top", "dress"] } } // Match specific categories
                    ]
                }
            },
            { $sample: { size: 1 } } // Get a random item
        ]);

        // Find a random "bottom" if "top" was selected
        let randomBottom = "";

        console.log('random top or dress', randomTopOrDress)
        if(randomTopOrDress.length > 0) {
            if (randomTopOrDress[0].category === "top") {
                const bottom = await Item.aggregate([
                    { $match: { tags: { $all: [occasion_type, weather_type] } } },
                    { $match: { category: "bottom" } },
                    { $sample: { size: 1 } }
                ]);
                console.log("bottom", bottom)
                randomBottom = bottom.length === 0 ? "" : bottom[0]._id;
            }
        }
        
        // Find a random pair of "shoes"
        const randomShoes = await Item.aggregate([
            { $match: { tags: { $all: [occasion_type, weather_type] } } },
            { $match: { category: "shoes" } },
            { $sample: { size: 1 } }
        ]);
        console.log("random shoes", randomShoes)

        const outfitDetails = { 
            top: randomTopOrDress.length === 0 ? "" : randomTopOrDress[0]._id,
            bottom: randomBottom,
            shoes: randomShoes.length === 0 ? "" :  randomShoes[0]._id,
            userId: userId
            //image: this is an advanced feature to place the items as one image
        };

        const outfit = new Outfit(outfitDetails);
        // console.log('newOutfit', outfitDetails);

        await outfit.save();

        let sendData = {
            id: outfit._id,
            top: outfit.top,
            bottom: outfit.bottom,
            shoes: outfit.shoes,
            favourite: outfit.favourite,
            createdAt: outfit.createdAt
        }

        console.log('send data', sendData)
        // res.status(201).json({outfit});
        res.status(201).json(sendData);

        } catch (error) {
        res.status(500).send({ error: error.message });
        }
    };
    

const createManual = async (req, res) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    const userId = getUserIdFromToken(token);
    try {
        //unpack the payload data. Expected data: _id of items.  
        top = req.body.top;
        shoes = req.body.shoes;
        if (req.body._id === !null) {
            bottom = req.body._id
        } else { 
            bottom = req.body.bottom;
        }
        
        const outfitDetails = { 
            top: top,
            bottom: bottom,
            shoes: shoes,
            userId: userId
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

//Update Favourite field from true to false / false to true 

const updateFav = async (req, res) => {
    try {
        //find document by outfit ID sent through the payload 
        objectId = req.body._id;
        favStatus = req.body.status;

        const updatedOutfit = await Outfit.findOneAndUpdate(
            { _id: objectId },
            { favourite: favStatus }, // Set favourite to true or false
            { new: true } // Return the updated document
        );

        if (!updatedOutfit) {
            return res.status(404).json({ error: error.message });
        }

        res.status(200).json({
            message: updatedOutfit.favourite ? "Your outfit is now favorited" : "You have unfavorited this outfit",
            updatedOutfit,
        });
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