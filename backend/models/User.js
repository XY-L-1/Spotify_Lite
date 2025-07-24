const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
   username:       { type: String, required: true, unique: true },
   email:          { type: String, required: true, unique: true },
   passwordHash:   { type: String, required: true },
   likedSongs:     [{ type: Schema.Types.ObjectId, ref: 'Song' }],
   followedArtists:[{ type: Schema.Types.ObjectId, ref: 'Artist' }],
});

// user Auth
userSchema.virtual('password').set(function(pw) {
   this.passwordHash = requrie('bcrypt').hashSync(pw, 10);
});

userSchema.methods.verifyPassword = function(pw) {
   return require('bcrypt').compareSync(pw, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
