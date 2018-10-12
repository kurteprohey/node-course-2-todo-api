const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// var data = {
//   id: 10
// };

// const token = jwt.sign(data, '123abc');
// console.log(token);
// const decoded = jwt.verify(token, '123abc');
// console.log('decoded', decoded);

var message = 'I am user number 1';
var hash = SHA256(message).toString();

// shaping the data from the backend side
var data = {
  // database id
  id: 'd324d343r2e23r54y56'
};

// sending from server to the client
var token = {
  data,
  hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
};

// on a client side trying to modify the data
token.data.id = 'd324d343r2e23r54y56';

// validating a token
var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
if (resultHash === token.hash) {
  // console.log('data was not changed');
} else {
  // console.log('do not trust');
}

var password = '123abc!';
bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(salt);
    console.log(hash);
  });
});

var hashedPassword = '$2a$10$Uis71QE/1WAMxJXT6KRVrOzK1EVIFyWgCfedxCc5.Y6VBR39feE/S';
bcrypt.compare('password', hashedPassword, (err, res) => {
  // console.log(res);
});
