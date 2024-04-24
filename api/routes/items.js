const express = require("express");
const ItemsController = require("../controllers/items");
const router = express.Router();

router.post("/", ItemsController.create);
router.get("/:id", ItemsController.getItem);

module.exports = router;