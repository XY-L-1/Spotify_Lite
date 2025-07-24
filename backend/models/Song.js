const mongoose = require('mongoose');
const {Schema} = mongoose;

const songSchema = new Schema ({
   title: {type: String, required: true},
   artist: {type: Schema.Types.ObjectId, ref: 'Artist', required: true},
   language: {type: String},
   genre: {type: String},
   audioUrl: { type: String },
});

module.exports = mongoose.model('Song', songSchema);