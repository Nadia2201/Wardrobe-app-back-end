const express = require("express");
const ItemsController = require("../controllers/items");
const router = express.Router();

router.post("/", ItemsController.create);
router.get("/:id", ItemsController.getItem);
router.delete("/:id", ItemsController.removeItem);
router.post("/search", ItemsController.searchByTags);
router.post("/updateFav", ItemsController.updateFav);
router.post("/favourites", ItemsController.getFavourites);

module.exports = router;