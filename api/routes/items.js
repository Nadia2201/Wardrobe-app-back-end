const express = require('express');
const router = express.Router();
const itemController = require('../controllers/items');

router.post('/', itemController.createItem);
router.get('/:id', itemController.getItem);

module.exports = router;