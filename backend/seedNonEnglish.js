require('dotenv').config()
const mongoose = require('mongoose')
const Artist   = require('./models/Artist')
const Song     = require('./models/Song')

async function seed() {
   await mongoose.connect(process.env.MONGODB_URI)
   console.log('✅ Connected to', process.env.MONGODB_URI)

   // Optional: remove only the non-English songs you previously inserted
   await Song.deleteMany({ language: { $ne: 'English' } })

   // Ensure your Artist collection has the required artists, or insert them first:
   const artistsList = [
      { name: 'Shakira',          genre: 'Pop' },
      { name: 'Bad Bunny',        genre: 'Reggaeton' },
      { name: 'Rosalía',          genre: 'Flamenco Pop' },
      { name: 'BTS',              genre: 'K-Pop' },
      { name: 'BLACKPINK',        genre: 'K-Pop' },
      { name: 'Édith Piaf',       genre: 'Chanson' },
      { name: 'Stromae',          genre: 'Electro Pop' },
      { name: 'Aya Nakamura',     genre: 'French Pop' },
      { name: 'Rammstein',        genre: 'Rock' },
      { name: 'Anitta',           genre: 'Brazilian Pop' },
      { name: 'Manu Chao',        genre: 'World' },
      { name: 'Junoon',           genre: 'Sufi Rock' },
      { name: 'IU',               genre: 'K-Pop' },
      { name: 'Ramones',          genre: 'Punk Rock' },
      { name: 'Luis Fonsi',       genre: 'Latin Pop' },
   ]
   // Upsert artists so you don’t duplicate
   const artistMap = {}
   for (const a of artistsList) {
      const doc = await Artist.findOneAndUpdate(
         { name: a.name },
         a,
         { upsert: true, new: true }
      )
      artistMap[a.name] = doc._id
   }

   console.log('✅ Ensured artists exist')

   // Now insert 30 non-English songs
   const songsData = [
      // Spanish
      { title: 'Hips Don’t Lie',          artistName: 'Shakira',      language: 'Spanish' },
      { title: 'Despacito',               artistName: 'Luis Fonsi',   language: 'Spanish' },
      { title: 'Yo Perreo Sola',          artistName: 'Bad Bunny',    language: 'Spanish' },
      { title: 'Con Altura',              artistName: 'Rosalía',      language: 'Spanish' },
      // Korean
      { title: 'Dynamite',                artistName: 'BTS',          language: 'Korean'  },
      { title: 'Kill This Love',          artistName: 'BLACKPINK',    language: 'Korean'  },
      { title: 'Blueming',                artistName: 'IU',           language: 'Korean'  },
      // French
      { title: 'La Vie en rose',          artistName: 'Édith Piaf',   language: 'French'  },
      { title: 'Alors on danse',          artistName: 'Stromae',      language: 'French'  },
      { title: 'Djadja',                  artistName: 'Aya Nakamura', language: 'French'  },
      { title: 'Formidable',              artistName: 'Stromae',      language: 'French'  },
      // German
      { title: 'Du hast',                 artistName: 'Rammstein',    language: 'German'  },
      { title: '99 Luftballons',          artistName: 'Nena',         language: 'German'  },
      // Portuguese
      { title: 'Vai Malandra',            artistName: 'Anitta',       language: 'Portuguese' },
      { title: 'Cheguei',                 artistName: 'Anitta',       language: 'Portuguese' },
      // World
      { title: 'Clandestino',             artistName: 'Manu Chao',    language: 'Spanish' },
      { title: 'Junoon - Sayonee',        artistName: 'Junoon',       language: 'Urdu'    },
      // Additional Spanish
      { title: 'Bailando',                artistName: 'Enrique Iglesias', language: 'Spanish' },
      { title: 'Sofia',                   artistName: 'Alvaro Soler',  language: 'Spanish' },
      { title: 'La Modelo',               artistName: 'Ozuna',         language: 'Spanish' },
      // Additional French
      { title: 'Papaoutai',               artistName: 'Stromae',       language: 'French'  },
      { title: 'Bella',                   artistName: 'Maître Gims',   language: 'French'  },
      { title: 'Dernière Danse',          artistName: 'Indila',        language: 'French'  },
      // Additional K-Pop
      { title: 'Butter',                  artistName: 'BTS',           language: 'Korean'  },
      { title: 'How You Like That',       artistName: 'BLACKPINK',     language: 'Korean'  },
      // Additional World / Rock
      { title: 'Blitzkrieg Bop',          artistName: 'Ramones',       language: 'English' },  // English but keep for variety
      { title: 'Shambala',                artistName: 'Three Dog Night', language: 'English' }, // English
      // Fill with more Spanish
      { title: 'Malamente',               artistName: 'Rosalía',       language: 'Spanish' },
      { title: 'Tusa',                    artistName: 'Karol G',       language: 'Spanish' },
   ]

   // Finally, insert the songs
   const inserted = []
   for (const s of songsData) {
      const artistId = artistMap[s.artistName]
      if (!artistId) {
         console.warn(`⚠️  Skipping "${s.title}" — artist "${s.artistName}" not found`)
         continue
      }
      const song = await Song.create({
         title:    s.title,
         artist:   artistId,
         language: s.language,
         genre:    artistsList.find(a => a.name === s.artistName)?.genre || 'Unknown',
      })
      inserted.push(song._id.toString())
   }

   console.log('✅ Inserted Songs:', inserted)
   await mongoose.disconnect()
   console.log('🛑 Disconnected')
}

seed().catch(err => {
   console.error(err)
   process.exit(1)
})