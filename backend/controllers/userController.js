const Artist = require('../models/Artist');
const Song   = require('../models/Song');
const User   = require('../models/User');

/* 
Get songs like by a user
GET /user/songs?userId=...
*/
exports.getLikedSongs = async(req, res) => {
   try{
      const userId = req.auth.sub;

      const user = await 
         User.findById(userId).populate({
            path: 'likedSongs',
            populate: {path: 'artist'}
         });
      res.json(user.likedSongs);
   }catch(err){
      res.status(500).json({error: err.message});
   }
};

/*
Get the user profile
GET /user/info?userId...
*/
exports.getProfile = async(req, res) => {
   try {
      const userId = req.auth.sub;
      const user = await User.findById(userId)
         .populate('likedSongs').populate('followedArtists');

      if (!user) return res.status(404).json({error: "User not found"});
      res.json(user);

   } catch (err) {
      res.status(500).json({error: err.message});
   }
}

/*
PUT /user/info
*/

exports.updateProfile = async(req, res) => {
   try{
      const userId = req.auth.sub;
      const {username, email, passwordHash} = req.body;

      const updated = await User.findByIdAndUpdate(
         userId,
         { username, email, passwordHash },
         { new: true }
      );
      res.json(updated);
   }catch(err){
      res.status(500).json({ error: err.message });
   }
};


exports.followArtist = async (req, res) => {
   try {
      const userId = req.auth.sub;
      const artistId = req.body.artistId;
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });

      if (!user.followedArtists.includes(artistId)) {
         user.followedArtists.push(artistId);
         await user.save();
      }

      await user.populate({
         path: 'likedSongs',
         populate: { path: 'artist' }
      });
      await user.populate('followedArtists');
      
      res.json(user);
   } catch (err) {
      console.error('💥 followArtist error:', err);
      res.status(500).json({ error: err.message });
   }
};

