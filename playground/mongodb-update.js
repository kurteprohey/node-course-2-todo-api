// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

const connectionString = 'mongodb://localhost:27017/TodoApp';

MongoClient.connect(connectionString, (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const db  = client.db('TodoApp');

  db.collection('Users').findOneAndUpdate(
    { _id: ObjectID('5bbb47661e86e9a1508f1b7e') },
    {
      $inc: {
        age: 1
      },
      $set: {
        name: 'Yehorka'
      }
    },
    { returnOriginal: false }
  ).then(result => {
    console.log(result);
  });
  
  // client.close();
});
