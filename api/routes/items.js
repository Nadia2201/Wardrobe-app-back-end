const express = require("express");
const ItemsController = require("../controllers/items");
const router = express.Router();

router.post("/", ItemsController.create);
router.get("/:id", ItemsController.getItem);
router.delete("/:id", ItemsController.removeItem);
router.post("/search", ItemsController.searchByTags);
//router.post("/updateFav", OutfitsController.updateFav);

module.exports = router;