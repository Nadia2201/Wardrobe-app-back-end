const Item = require("../models/item");

// Function to create a new item
const create = async (req, res) => {
    try {
        const itemDetails = { 
            name: req.body.name, 
            category: req.body.category, 
            tags: req.body.tags, 
            image: req.body.image 
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

const updateFav = async (req, res) => {
    try {
        _id = req.body._id;

        const updatedItem = await Item.findOneAndUpdate(
            { _id: _id },
            { favourite: true }, // Set favourite to true
            { new: true } // Return the updated document
        );

        if (!updatedItem) {
            return res.status(404).json({ error: "Item not found" });
        }

        res.status(200).json({ message: "Item favourite status updated", updatedItem });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// get all favourite outfits
const getFavourites = async (req, res) => {
    try {
        const favoriteItems = await Item.find({ favourite: true });
        res.status(200).json({ items: favoriteItems });
     } catch (error) {
        res.status(500).json({ error: error.message });
  }
};


const ItemsController = {
    create: create,
    getItem: getItem,
    removeItem: removeItem,
    searchByTags: searchByTags,
    updateFav: updateFav,
    getFavourites: getFavourites 
};

module.exports = ItemsController;

