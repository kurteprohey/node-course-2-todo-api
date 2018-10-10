const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/Todo');
const {User} = require('./../server/models/User');

const {ObjectID} = require('mongodb');

// var id = '5bbdfe9b16b7cc6302f683ae';
// console.log(ObjectID.isValid(id));

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// });

// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo);
// })

// Todo.findById(id)
//   .then((todo) => {
//     if (!todo) {
//       return console.log('ID not found');
//     }
//     console.log('Todo', todo);
//   })
//   .catch((e) => console.log(e));

User.findById('6bbb75895782fe15747fee06')
  .then((user) => {
    if (!user) {
      return console.log('User not found');
    }
    console.log('User', user);
  })
  .catch((e) => console.log(e));