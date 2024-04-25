const Item = require("../models/item");
const fs = require('fs');
const { getUserIdFromToken } = require("../middleware/tokenChecker")


// Function to create a new item
const create = async (req, res) => {

    const imageToBase64 = fs.readFileSync(req.body.image);
    const base64Image = Buffer.from(imageToBase64).toString('base64');
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    const userId = getUserIdFromToken(token);
    
    try {
        const itemDetails = { 
            name: req.body.name, 
            category: req.body.category, 
            tags: req.body.tags, 
            image: base64Image, 
            userId: userId
        };
 
        const item = new Item(itemDetails);
        console.log('newItem', item);

        await item.save();
        res.status(201).json({ message: `Item created, id: ${item._id.toString()}`});
    } 
    catch (error) {
        res.status(400).json({ message: `This went wrong: ${error.message}` });
    }
};

// Function to get item

const getItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        res.status(200).json(item);
    } catch (error) {
        res.status(400).send({ message: "Couldn't retrieve item"});
    }
}

// Function to remove item

const removeItem = async (req, res) => {
    try {
        const itemId = req.params.id;
        const deletedItem = await Item.findByIdAndDelete(itemId);
        res.status(200).json({ message: `Item deleted: ${deletedItem}`});
    } catch (error) {
        res.status(500).json({ message: `Couldn't remove item: ${error.message}` });
    }
}

// Function to search by tags

const searchByTags = async (req, res) => {
    try {
        const tags = req.body.tags;
        const items = await Item.find({ tags: { $in: tags } });
        res.status(200).json(items);

    } catch (error) {
        res.status(500).json({ message: `Couldn't search by tags: ${error.message}` });
    }
}


const ItemsController = {
    create: create,
    getItem: getItem,
    removeItem: removeItem,
    searchByTags: searchByTags
};

module.exports = ItemsController;

