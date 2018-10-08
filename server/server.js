const express = require('express');
const bodyParser = require('body-parser');
const {mongoose} = require('./db/mongoose');

// requiring db models
const {User} = require('./models/user');
const {Todo} = require('./models/Todo');

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  console.log(req.body);
  var todo = new Todo({text: req.body.text});
  todo.save().then(
    (doc) => {
      res.send(doc);
    },
    (err) => {
      res.status(400).send(err);
    }
  );
});

// app.get('/todos', (req, res) => {

// });

app.listen(3333, () => {
  console.log('Started on port 3333');
});