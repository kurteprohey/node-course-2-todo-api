const mongoose = require('mongoose');

const prodDb = 'mongodb://admin:test123@ds225703.mlab.com:25703/todoappyehor';
const localDb = 'mongodb://localhost:27017/TodoApp';
const dbConnectionString = process.env.PORT ? prodDb : localDb;

mongoose.Promise = global.Promise;
mongoose.connect(localDb, { useNewUrlParser: true });

module.exports = {
  mongoose
};