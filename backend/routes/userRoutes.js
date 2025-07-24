const router = require('express').Router();
const { getLikedSongs, updateProfile, getProfile, followArtist } = require('../controllers/userController');

router.get('/songs', getLikedSongs);
router.get('/info', getProfile);
router.put('/info', updateProfile);
router.put('/artists', followArtist);

module.exports = router;