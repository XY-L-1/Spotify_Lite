require('dotenv').config();
const mongoose = require('mongoose');
const app      = require('./app');

const uri =
   process.env.NODE_ENV === 'test'
      ? process.env.MONGODB_URI_TEST
      : process.env.MONGODB_URI;

mongoose
   .connect(uri)
   .then(() => console.log('✅ MongoDB connected'))
   .catch(err => console.error('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
   console.log(`🚀 Server Listening on http://localhost:${PORT}`);
})
