const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true},
    category: { type: String, required: true},
    tags: [{ type: String }],
    image: { type: mongoose.Schema.Types.ObjectId, ref: 'uploads' },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Item = mongoose.model("Item", ItemSchema);

module.exports = Item;