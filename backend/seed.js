// backend/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const User   = require('./models/User');
const Artist = require('./models/Artist');
const Song   = require('./models/Song');

async function seed() {
   // 1. Connect
   await mongoose.connect(process.env.MONGODB_URI);
   console.log('✅ Connected to', process.env.MONGODB_URI);

   // 2. Clear existing data
   await User.deleteMany({});
   await Artist.deleteMany({});
   await Song.deleteMany({});

   // 3. Create a test user
   const user = await User.create({
      username: 'testuser_1',
      email:    'test_1@gmail.com',
      passwordHash: 'test_1',
      likedSongs:    [],
      followedArtists:[]
   });
   console.log('Inserted User:', user._id.toString());

   // 4. Create some artists
   const artistsData = [
      { name: 'Ed Sheeran',     genre: 'Pop' },
      { name: 'Adele',          genre: 'Pop' },
      { name: 'The Weeknd',     genre: 'R&B' },
      { name: 'Bruno Mars',     genre: 'Funk' },
      { name: 'Pharrell Williams', genre: 'Pop' },
      { name: 'Daft Punk',      genre: 'Electronic' },
      { name: 'Taylor Swift',   genre: 'Pop' },
      { name: 'Lewis Capaldi',  genre: 'Pop' },
      { name: 'Billie Eilish',  genre: 'Pop' },
      { name: 'Shawn Mendes',   genre: 'Pop' },
      { name: 'Justin Timberlake', genre: 'Pop' },
      { name: 'Justin Bieber',  genre: 'Pop' },
      { name: 'The Chainsmokers', genre: 'Electronic' },
      { name: 'Halsey',         genre: 'Pop' },
      { name: 'The Kid LAROI',  genre: 'Pop' },
      { name: 'Imagine Dragons',genre: 'Rock' },
      { name: 'Coldplay',       genre: 'Rock' },
      { name: 'OneRepublic',    genre: 'Pop Rock' },
   ];
   const artists = await Artist.insertMany(artistsData);
   const artistMap = Object.fromEntries(
      artists.map(a => [a.name, a._id])
   );
   console.log('Inserted Artists:', artists.map(a => a._id.toString()));

   // 5. Create songs with working sample MP3 URLs
   // SoundHelix provides a handful of sample MP3s (you can mix & match)
   const sampleBase = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-';
   const songsData = [
      { title: 'Shape of You',           artistName: 'Ed Sheeran',     sampleId: 1 },
      { title: 'Thinking Out Loud',      artistName: 'Ed Sheeran',     sampleId: 2 },
      { title: 'Hello',                  artistName: 'Adele',          sampleId: 3 },
      { title: 'Rolling in the Deep',    artistName: 'Adele',          sampleId: 4 },
      { title: 'Blinding Lights',        artistName: 'The Weeknd',     sampleId: 5 },
      { title: 'Starboy',                artistName: 'The Weeknd',     sampleId: 6 },
      { title: 'Uptown Funk',            artistName: 'Bruno Mars',     sampleId: 7 },
      { title: 'Locked Out of Heaven',   artistName: 'Bruno Mars',     sampleId: 8 },
      { title: 'Happy',                  artistName: 'Pharrell Williams', sampleId: 9 },
      { title: 'Get Lucky',              artistName: 'Daft Punk',      sampleId: 10 },
      { title: 'Shake It Off',           artistName: 'Taylor Swift',   sampleId: 11 },
      { title: 'Blank Space',            artistName: 'Taylor Swift',   sampleId: 12 },
      { title: 'Someone You Loved',      artistName: 'Lewis Capaldi',  sampleId: 13 },
      { title: 'Bad Guy',                artistName: 'Billie Eilish',  sampleId: 14 },
      { title: 'Senorita',               artistName: 'Shawn Mendes',   sampleId: 15 },
      { title: 'Treat You Better',       artistName: 'Shawn Mendes',   sampleId: 16 },
      { title: "Can't Stop the Feeling", artistName: 'Justin Timberlake', sampleId: 17 },
      { title: 'Sorry',                  artistName: 'Justin Bieber',  sampleId: 18 },
      { title: 'What Do You Mean?',      artistName: 'Justin Bieber',  sampleId: 19 },
      { title: 'Closer',                 artistName: 'The Chainsmokers', sampleId: 20 },
      { title: 'Stay',                   artistName: 'The Kid LAROI',  sampleId: 21 },
      { title: 'Believer',               artistName: 'Imagine Dragons', sampleId: 22 },
      { title: 'Radioactive',            artistName: 'Imagine Dragons', sampleId: 23 },
      { title: 'Thunder',                artistName: 'Imagine Dragons', sampleId: 24 },
      { title: 'Viva La Vida',           artistName: 'Coldplay',       sampleId: 25 },
      { title: 'Paradise',               artistName: 'Coldplay',       sampleId: 26 },
      { title: 'Adventure of a Lifetime',artistName: 'Coldplay',       sampleId: 27 },
      { title: 'Counting Stars',         artistName: 'OneRepublic',    sampleId: 28 },
      { title: 'Apologize',              artistName: 'OneRepublic',    sampleId: 29 },
      { title: 'Love Yourself',          artistName: 'Justin Bieber',  sampleId: 30 },
   ];

   const songs = await Song.insertMany(
      songsData.map(s => {
         const genre = artistsData.find(a => a.name === s.artistName)?.genre || 'Unknown';
         return {
         title:    s.title,
         artist:   artistMap[s.artistName],
         language: 'English',
         genre,
         audioUrl: `${sampleBase}${s.sampleId}.mp3`  // e.g. .../SoundHelix-Song-1.mp3
         };
      })
   );
   console.log('Inserted Songs:', songs.length);

   // 6. Exit
   await mongoose.disconnect();
   console.log('✅ Seeding complete');
}

seed().catch(err => {
   console.error(err);
   process.exit(1);
});
