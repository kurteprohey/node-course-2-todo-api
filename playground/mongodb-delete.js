// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

const connectionString = 'mongodb://localhost:27017/TodoApp';

MongoClient.connect(connectionString, (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const db  = client.db('TodoApp');

  // db.collection('Todos').deleteMany({text: 'Eat lunch'})
  //   .then((results) => {
  //     console.log(results);
  //   });

  // db.collection('Todos').deleteOne({text: 'Eat lunch'})
  //   .then((results) => {
  //     console.log(results);
  //   });

  db.collection('Users').findOneAndDelete({
    _id: new ObjectID('5bbb47711e86e9a1508f1b85')
  })
    .then((result) => {
      console.log(result);
    });
  // client.close();
});
