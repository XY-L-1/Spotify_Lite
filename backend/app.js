require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { expressjwt: jwtMiddleware } = require('express-jwt');
const app = express();

const { JWT_SECRET } = process.env
if (!JWT_SECRET) {
   console.error(' _______________ Missing JWT_SECRET in .env!')
   process.exit(1)
}

const userRoutes   = require('./routes/userRoutes');
const songRoutes   = require('./routes/songRoutes');
const artistRoutes = require('./routes/artistRoutes');


app.use(cors()); 
app.use(express.json());
app.use('/auth', require('./routes/authRoutes'));
app.use(
   jwtMiddleware({ secret: JWT_SECRET, algorithms: ['HS256'] }).unless({
      path: [
         { url: /^\/auth\/.*/, methods: ['POST'] },
         { url: '/songs',           methods: ['GET'] },
         { url: /^\/public\/.*/,    methods: ['GET'] },
      ]
   })
);


// Mount routes
app.use('/user',   userRoutes);
app.use('/songs',  songRoutes);

// auth error handler
app.use((err, req, res, next) => {
   if (err.name === 'UnauthorizedError') {
      return res.status(401).json({ message: 'Invalid or missing token' });
   }
   next(err);
});

module.exports = app;