const express = require('express');
const bodyParser = require('body-parser');
const {mongoose} = require('./db/mongoose');
const {ObjectID} = require('mongodb');
// requiring db models
const {User} = require('./models/user');
const {Todo} = require('./models/todo');

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
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

app.get('/todos', (req, res) => {
  Todo.find().then(
    (todos) => res.send({todos}),
    (err) => res.statusCode(400).send(err)
  );
});

// GET /todos/123213

app.get('/todos/:id', (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    res.status(404).send();
  }
  Todo.findById(id).then(
    (todo) => res.send({todo}),
    (err) => res.statusCode(400).send()
  );
});

app.listen(3333, () => {
  console.log('Started on port 3333');
});

module.exports = {
  app
};
