const mongoose = require('mongoose');

const prodDb = 'mongodb://admin:test123@ds225703.mlab.com:25703/todoappyehor';

mongoose.Promise = global.Promise;
mongoose.connect(prodDb, { useNewUrlParser: true });

module.exports = {
  mongoose
};