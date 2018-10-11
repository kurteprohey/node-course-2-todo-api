const {mongoose} = require('./../server/db/mongoose');
const {ObjectId} = require('mongodb');
// requiring db models
const {User} = require('./../server/models/user');
const {Todo} = require('./../server/models/todo');

// Todo.remove({})
// Todo.findOneAndRemove({})
Todo.findByIdAndRemove('5bbf18df1e86e9a1508f559b')
  .then((todo) => {
    console.log('Todo removed', todo);
  });