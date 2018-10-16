// prepare the env variable
const env = process.env.NODE_ENV || 'development';
if (env === 'development') {
  process.env.PORT = 3333;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test') {
  process.env.PORT = 3333;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
} else if (env === 'production') {
  process.env.MONGODB_URI = 'mongodb://admin:test123@ds225703.mlab.com:25703/todoappyehor';
}
// library imports
const express = require('express');
const bodyParser = require('body-parser');
const {mongoose} = require('./db/mongoose');
const {ObjectId} = require('mongodb');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

// requiring db models
const {User} = require('./models/user');
const {Todo} = require('./models/todo');
const {authenticate} = require('./middleware/authenticate');

const app = express();
// const port = process.env.PORT || 3333;

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

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findByIdAndRemove(id)
    .then(
      (todo) => {
        if (!todo) {
          return res.status(404).send();
        }
        res.send({todo});
      },
      (err) => res.status(400).send()
    );
});

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);
  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  console.log('updating object with', body);
  Todo.findByIdAndUpdate(id, {$set: body}, {new: true})
    .then(
      (todo) => {
        if (!todo) {
          return res.status(404).send();
        }
        res.status(200).send({todo});
      },
      (err) => res.status(400).send()
    )
});

// User routes
app.post('/users', (req, res) => {
  var userData = _.pick(req.body, ['email', 'password']);
  var user = new User(userData);
  user.save()
    .then(() => {
      return user.generateAuthToken();
    })
    .then((token) => {
      res.header('x-auth', token).send({user});
    })
    .catch((err) => res.status(400).send());
});

app.get('/users/me', authenticate, (req, res) => {
  res.send({user: req.user});
});

app.post('/users/login', (req, res) => {
  const {email, password} = req.body;
  User.findByCredentials(email, password)
    .then((user) => {
      return user.generateAuthToken().then((token) => {
        res.header('x-auth', token).send({user});
      });
    })
    .catch((err) => res.status(400).send());
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token)
    .then(() => {
      res.status(200).send();
    })
    .catch(() => {
      res.status(400).send();
    });
});

app.listen(process.env.PORT, () => {
  console.log(`Started on port ${process.env.PORT}`);
});

module.exports = {
  app
};
