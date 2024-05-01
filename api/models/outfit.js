const mongoose = require("mongoose");

const OutfitSchema = new mongoose.Schema({
  top: { type: String },
  bottom: { type: String },
  shoes: { type: String },
  favourite: { type: Boolean, default: false }, 
  createdAt: { type: Date, default: Date.now },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
}
  // image: advanced feature to combine top, bottom and shoes in one image. 
});

const Outfit = mongoose.model("Outfit", OutfitSchema);

module.exports = Outfit;
