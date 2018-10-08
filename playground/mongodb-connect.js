// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

const connectionString = 'mongodb://localhost:27017/TodoApp';

MongoClient.connect(connectionString, (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const db  = client.db('TodoApp');

  // db.collection('Todos').insertOne({
  //   text: 'something to do',
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert todo', err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });
  // db.collection('Users').insertOne({
  //   name: 'Yehor',
  //   age: 25,
  //   location: 'Berlin'
  // }, (err, result) => {
  //   if (err) {
  //     console.log('Unable to insert new user', err);
  //     return;
  //   }
  //   console.log(result.ops[0]._id.getTimestamp());
  // })

  client.close();
});
