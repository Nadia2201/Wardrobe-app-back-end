const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true},
    category: { type: String, required: true},
    tags: [{ type: String }],
    image: { type: String}, // Base64 encoded image
});

const Item = mongoose.model("Item", ItemSchema);

module.exports = Item;