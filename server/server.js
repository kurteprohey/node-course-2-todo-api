const express = require('express');
const bodyParser = require('body-parser');
const {mongoose} = require('./db/mongoose');
const {ObjectId} = require('mongodb');
// requiring db models
const {User} = require('./models/user');
const {Todo} = require('./models/todo');

const app = express();
const port = process.env.PORT || 3333;

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
  console.log(ObjectId.isValid(id));
  if (!ObjectId.isValid(id)) {
    console.log('ID is invalid');
    res.status(404).send();
    return;
  }
  Todo.findById(id).then(
    (todo) => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({todo})
    },
    (err) => res.status(400).send()
  );
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {
  app
};
