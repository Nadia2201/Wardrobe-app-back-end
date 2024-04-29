const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true},
    category: { type: String, required: true},
    tags: [{ type: String }], //lumped season; occasion; colour 
    image: { type: String}, // Base64 encoded image
    favourite: { type: Boolean, default: false }, 
});

const Item = mongoose.model("Item", ItemSchema);

module.exports = Item;