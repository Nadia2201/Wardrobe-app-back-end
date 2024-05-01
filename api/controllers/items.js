const Item = require("../models/item");
const fs = require('fs');
const JWT = require("jsonwebtoken");
const { getUserIdFromToken } = require("../middleware/tokenChecker")
const { getGFSBucket } = require("../models/gridfsbucket"); // Import the GridFSBucket instance
const { Readable } = require('stream');

// Function to create a new item
const create = async (req, res) => {

    try {
        const imageToBase64 = req.body.image;
        const gfsBucket = getGFSBucket(); // Retrieve the GridFSBucket instance
    
        if (!imageToBase64) {
            throw new Error("No image data provided");
        }

        const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
        const userId = getUserIdFromToken(token);

        // Decode the base64 image and convert it to a readable stream
        const buffer = Buffer.from(imageToBase64, 'base64');
        const readStream = new Readable();
        readStream.push(buffer);
        readStream.push(null);

       // Create a write stream with GridFSBucket
        const writeStream = gfsBucket.openUploadStream(`image-${Date.now()}.jpg`);

        writeStream.on("error", (err) => {
            console.error("Error during write stream:", err);
            res.status(500).json({ message: "Error during upload", error: err });
        });

        // Pipe the read stream into GridFSBucket
        readStream.pipe(writeStream);

        // Once the stream is finished, create the Item document
        writeStream.on("finish", () => {
            const itemDetails = {
                name: req.body.name,
                category: req.body.category, 
                tags: req.body.tags, 
                image: writeStream.gridFSFile._id,
                userId: userId
            };
    
            const item = new Item(itemDetails);
            console.log('new item = ', item);
            item.save();
            res.status(201).json({ message: `Item created, id: ${item._id.toString()}`});
        });
    } catch (err) {
        res.status(500).json({ message: 'Error saving item', error: err });
    }
};


// Function to get item
const getItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if(!item) {
            return res.status(404).send({ error: 'Item not found!' });
        }

        const gfsBucket = getGFSBucket(); // access GridFS to retrieve the image using GridFSBucket
        const imageId = item.image; // get the reference for the image

        //create a buffer to capture the image data
        let imageBuffer = [];

        //create a read stream from GridFS
        const readStream = gfsBucket.openDownloadStream(imageId);

        readStream.on("data", (chunk) => {
            imageBuffer.push(chunk);
        });

        readStream.on("end", () => {
            //convert buffer to Base64
            const imageBase64 = Buffer.concat(imageBuffer).toString('base64');

            // return item details along with the Base64 image
            const response = {
                id: item._id,
                name: item.name,
                category: item.category,
                image: imageBase64,
                tags: item.tags,
            };

            console.log(response)
            res.send(response);
        });

        readStream.on("error", (error) => {
            res.status(500).send({ error: error.message });
        });

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// function to get all items (max of 10)
const getAllItems = async (req, res) => {
    try {
        const items = await Item.find();
        const gfsBucket = getGFSBucket();
        const response = [];

        for(const item of items) {
            const imageId = item.image;

            let imageBase64 = "";

            if(imageId) {
                //read the image from GridFS
                const imageBuffer = await new Promise((resolve, reject) => {
                    const chunks = [];
                    const readStream = gfsBucket.openDownloadStream(imageId);

                    readStream.on("data", (chunk) => {
                        chunks.push(chunk);
                    });

                    readStream.on("end", () => {
                        resolve(Buffer.concat(chunks));
                    });

                    readStream.on("error", (err) => {
                        reject(err);
                    });
                });

                imageBase64 = imageBuffer.toString("base64");
            }
            // include the item details with base64 encoded image
            response.push({
                id: item._id,
                name: item.name,
                category: item.category,
                tags: item.tags,
                image: imageBase64,
                favourite: item.favourite,
            });
            if(item.favourite) {
                console.log(item.id, item.name, item.favourite)
            }
            
        }

        
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: "Error fetching all items", error: err });
    }
};




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
        //find document by outfit ID sent through the payload 
        objectId = req.body._id;
        favStatus = req.body.status;

        console.log(objectId, favStatus)
        const updatedItem = await Item.findOneAndUpdate(
            { _id: objectId },
            { favourite: favStatus }, // Set favourite to true or false
            { new: true } // Return the updated document
        );

        if (!updatedItem) {
            return res.status(404).json({ error: error.message });
        }

        console.log('updatedItem:', updatedItem)
        res.status(200).json({
            message: updatedItem.favourite ? "Your item is now favorited" : "You have unfavorited this item",
            updatedItem,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// get all favourite items
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
    getAllItems: getAllItems,
    removeItem: removeItem,
    searchByTags: searchByTags,
    updateFav: updateFav,
    getFavourites: getFavourites 
};

module.exports = ItemsController;

