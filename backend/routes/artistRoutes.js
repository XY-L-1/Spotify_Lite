const router = require('express').Router();
const { followArtist } = require('../controllers/artistController');

router.put('/', followArtist);

module.exports = router;