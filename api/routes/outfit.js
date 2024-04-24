const express = require("express");
const router = express.Router();
const OutfitsController = require("../controllers/outfit");

router.post("/", OutfitsController.create);
//router.get("/", OutfitsController.getFavourites);

module.exports = router;
