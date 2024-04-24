const express = require("express");
const router = express.Router();
const OutfitController = require("../controllers/outfit");

router.post("/", OutfitController.create);
//router.get("/", OutfitController.getFavourites);

module.exports = router;
