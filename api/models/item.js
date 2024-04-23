const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: String,
    category: String,
    tags: [String],
    image: String, // Base64 encoded image
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;