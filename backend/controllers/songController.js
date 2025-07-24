const Artist = require('../models/Artist');
const Song   = require('../models/Song');
const User   = require('../models/User');

/*
GET /songs?search=&language=...&genre=...
*/
exports.searchSongs = async (req, res) => {
   try {
      const { search = '', language, genre } = req.query
      
      const baseQuery = {
         ...(language && { 
         language: { $regex: new RegExp(`^${language}$`, 'i') }
         }),
         ...(genre && { 
         genre:    { $regex: new RegExp(`^${genre}$`, 'i') }
         }),
      }

      let songs = await Song.find(baseQuery).populate('artist')

      if (search) {
         const songRegex = new RegExp(search, 'i')
         songs = songs.filter(s =>
         songRegex.test(s.title) || songRegex.test(s.artist.name)
         )
      }

      return res.json(songs)
   } catch (err) {
      return res.status(500).json({ error: err.message })
   }
}

/*
User likes a song
PUT /songs
*/
// exports.likeSong = async (req, res) => {
//    const { userId, songId } = req.body;
//    try{
//       const user = await User.findById(userId);

//       if(!user.likedSongs.includes(songId)) {
//          user.likedSongs.push(songId);
//          await user.save();
//       }

//       res.json(user);
//    } catch (err) {
//       res.status(500).json({ error: err.message });
//    }
// };

exports.likeSong = async (req, res) => {

   try {
      const userId = req.auth.sub;
      const { songId } = req.body;
      const user = await User.findById(userId);
      if (!user) {
         return res.status(404).json({ error: 'User not found' });
      }

      if (!user.likedSongs.includes(songId)) {
         user.likedSongs.push(songId);
         await user.save();
      }

      await user.populate({
         path: 'likedSongs',
         populate: { path: 'artist' }
      });

      return res.json(user);
   } catch (err) {
      console.error('likeSong error:', err);
      res.status(500).json({ error: err.message });
   }
};