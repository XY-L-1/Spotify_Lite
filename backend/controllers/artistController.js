const Artist = require('../models/Artist');
const Song   = require('../models/Song');
const User   = require('../models/User');
/*
User follows an artist
PUT /artists
*/
exports.followArtist = async (req, res) => {
   const { userId, artistId } = req.body;

   try{
      const user = await User.findById(userId);
      if( !user.followedArtists.includes(artistId) ) {
         user.followedArtists.push(artistId);
         await user.save();
      }

      await user.populate('followedArtists');
      res.json(user);
   } catch (err) {
      res.status(500).json( {error: err.message });
   }
};

