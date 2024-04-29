const express = require("express");
const router = express.Router();
const OutfitsController = require("../controllers/outfits");

router.post("/", OutfitsController.create);
router.post("/createManual", OutfitsController.createManual); //for clarity: this is a subroute of outfits
router.post("/createByTag", OutfitsController.createByTag);
//router.post("/favourites", OutfitsController.getFavourites);
router.post("/updateFav", OutfitsController.updateFav);

module.exports = router;
