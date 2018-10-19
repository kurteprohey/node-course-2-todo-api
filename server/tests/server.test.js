const request = require('supertest');
const expect = require('expect');
const {ObjectId} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');
const {User} = require('../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((err) => done(err));
      })
  });
  it('should not create todo with invalid body data', (done) => {
    var text = '';
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({text})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((err) => done(err));
      })
  })

});


describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe('GET /todos/id', (done) => {
  it('should return 404 if todo is not found', (done) => {
    request(app)
      .get(`/todos/${new ObjectId().toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
  it('should return 404 for non object id', (done) => {
    request(app)
      .get(`/todos/123`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
  it('should return a todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });
  it('should not return a todo doc created by other user', (done) => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', (done) => {
  it('should return 404 if todo is not found', (done) => {
    request(app)
      .delete('/todos/asdasd')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
  it('should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toBeFalsy();
          done();
        }).catch((e) => done(e));
      });
  });
  it('should not remove a todo if it was created by another user', (done) => {
    var hexId = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toBeTruthy();
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('PATCH /todos/:id', (done) => {
  it('should update the todo', (done) => {
    let newTodo = Object.assign({}, todos[0]);
    newTodo.completed = true;
    newTodo.text = 'Updated text of first todo';
    const targetTodoId = todos[0]._id;
    request(app)
      .patch(`/todos/${targetTodoId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send(newTodo)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completed).toBe(newTodo.completed);
        expect(res.body.todo.text).toBe(newTodo.text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.findById(targetTodoId).then(
          (todo) => {
            expect(todo.text).toEqual(newTodo.text);
            expect(todo.completed).toBe(newTodo.completed);
            done();
          },
          (err) => done(err)
        )
      });
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.user._id).toBe(users[0]._id.toHexString());
        expect(res.body.user.email).toBe(users[0].email);
      })
      .end(done);
  });
  it('should return 401 if not authenticated', (done) => {
    // without token
    // body is equal to an empty object
    // use toEqual
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({})
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    const email = 'example@example.com';
    const password = '123mbd';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body.user._id).toBeTruthy();
        expect(res.body.user.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        User.findOne({email}).then(
          (user) => {
            expect(user).toBeTruthy();
            expect(user.password).not.toBe(password);
            done();
          }
        ).catch((e) => done(e));
      });
  });
  it('should return validation errors if request is invalid', (done) => {
    // expect 400 to come back
    const email = 'dasd@';
    const password = 'd';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });
  it('should not create a user if email in use', (done) => {
    // email from the seed data
    // expect 400 to come back
    const email = users[0]._id.toString();
    const password = '232234fsd';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  
  it('should login user and return a token', (done) => {
    const {email, password, _id} = users[1];
    request(app)
      .post('/users/login')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(_id)
          .then((user) => {
            expect(user.tokens[1]).toMatchObject({
              access: 'auth',
              token: res.headers['x-auth']
            });
            done();
          })
          .catch((e) => done(e));
      });
  });
  it('should reject invalid login', (done) => {
    const {email, _id} = users[1];
    const password = 'boom';
    request(app)
      .post('/users/login')
      .send({email, password})
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeFalsy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(_id)
          .then((user) => {
            expect(user.tokens.length).toEqual(1);
            done();
          })
          .catch((e) => done(e));
      });
  });
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    // make delete request
    // set x-auth equal to token
    // 200 back
    // find user in db
    // tokens array has length of 0
    const token = users[0].tokens[0].token;
    const userId = users[0]._id;
    request(app)
      .delete('/users/me/token')
      .set('x-auth', token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(userId)
          .then((user) => {
            expect(user.tokens.length).toEqual(0);
            done();
          })
          .catch((err) => done(err));
      });
  });
});