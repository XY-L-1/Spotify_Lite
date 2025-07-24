const router = require('express').Router();
const { search } = require('../app');
const { searchSongs, likeSong } = require('../controllers/songController');

router.get('/', searchSongs);
router.put('/', likeSong);

module.exports = router;