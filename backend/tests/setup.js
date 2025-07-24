require('dotenv').config();
process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');

module.exports = {
   async connect() {

      // Connect to the Atalas Database
      await mongoose.connect(process.env.MONGODB_URI_TEST, {

      });
   },
   async closeDatabase() {
      // clear everything
      await mongoose.connection.dropDatabase(); 
      await mongoose.disconnect();
   },
   async clearDatabase() {
      // remove all data between tests
      const collections = mongoose.connection.collections;
      for (const key in collections){
         await collections[key].deleteMany({});
      }
   }
};

