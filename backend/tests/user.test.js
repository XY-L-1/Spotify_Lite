require('dotenv').config();  
jest.setTimeout(30000);              
const jwt       = require('jsonwebtoken');
const request   = require('supertest');
const app       = require('../app');
const setup     = require('./setup');
const User      = require('../models/User');
const Artist    = require('../models/Artist');
const Song      = require('../models/Song');

const { JWT_SECRET } = process.env;
if (!JWT_SECRET) throw new Error('Missing JWT_SECRET in environment');

beforeAll(async () => {
   await setup.connect();
});

afterEach(async () => {
   await setup.clearDatabase();
});

afterAll(async () => {
   await setup.closeDatabase();
});

describe('User Profile', () => {
   it('allows user to view and then edit their profile', async () => {
      const user = await User.create({
         username:     'Test User 1',
         email:        'test1@gmail.com',
         passwordHash: 'test1',
      });
      const userId = user._id.toString();
      const token  = jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '1h' });

      // view
      const res1 = await request(app)
         .get('/user/info')
         .set('Authorization', `Bearer ${token}`);
      expect(res1.statusCode).toBe(200);
      expect(res1.body.username).toBe('Test User 1');
      expect(res1.body.email).toBe('test1@gmail.com');

      // edit
      const res2 = await request(app)
         .put('/user/info')
         .set('Authorization', `Bearer ${token}`)
         .send({
         username:     'newTest1',
         email:        'newTest1@bar.com',
         passwordHash: 'newHash',
         });
      expect(res2.statusCode).toBe(200);
      expect(res2.body.username).toBe('newTest1');
      expect(res2.body.email).toBe('newTest1@bar.com');
   });
   });

   describe('View & Like Song', () => {
   let userId, songId, token;

   beforeEach(async () => {
      const artist = await Artist.create({
         name:  'Artist_A',
         genre: 'Genre_A',
      });
      const song = await Song.create({
         title:    'Test Song A',
         artist:   artist._id,
         language: 'English',
         genre:    'Pop',
      });
      songId = song._id.toString();

      const user = await User.create({
         username:     'u1',
         email:        'u1@qq.com',
         passwordHash: 'u1password',
      });
      userId = user._id.toString();
      token  = jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '1h' });
   });

   it('allows user to like a song', async () => {
      const res = await request(app)
         .put('/songs')
         .set('Authorization', `Bearer ${token}`)
         .send({ songId });

      expect(res.statusCode).toBe(200);
      const likedIds = res.body.likedSongs.map(s => s._id.toString());
      expect(likedIds).toContain(songId);
   });

   it('allows user to view liked songs', async () => {
      // first like it
      await request(app)
         .put('/songs')
         .set('Authorization', `Bearer ${token}`)
         .send({ songId });

      // then fetch
      const res = await request(app)
         .get('/user/songs')
         .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].title).toBe('Test Song A');
   });
});
