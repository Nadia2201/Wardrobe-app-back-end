const mongoose = require("mongoose");

const OutfitSchema = new mongoose.Schema({
  //automatically generated name: { type: String },
  top: { type: String },
  bottom: { type: String },
  shoes: { type: String },
  // created at: Date
  // favourite: { type: boolean, default: false} 
});

const Outfit = mongoose.model("Outfit", OutfitSchema);

module.exports = Outfit;
