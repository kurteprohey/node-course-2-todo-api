// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

const connectionString = 'mongodb://localhost:27017/TodoApp';

MongoClient.connect(connectionString, (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const db  = client.db('TodoApp');
  // cursor => pointer to those documents
  // db.collection('Todos').find({
  //   _id: new ObjectID('5bb76f0abc47d66892f95fb8')}).toArray().then((docs) => {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('unable to fetch todos');
  // });

  db.collection('Users').find().toArray().then(
    (users) => console.log(JSON.stringify(users, undefined, 2)),
    (err) => console.log('could not fetch the users')
  );

  // client.close();
});
