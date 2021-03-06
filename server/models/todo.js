const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  },
  _creator: {
    require: true,
    type: mongoose.Schema.Types.ObjectId
  }
});

const Todo = mongoose.model('Todo', userSchema);

module.exports = {
  Todo
};