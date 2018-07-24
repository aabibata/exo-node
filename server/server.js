const express = require('express');
const _ = require('lodash')

var bodyParser = require('body-parser');
var {mongoose}= require('./db/mongoose');
var {Todo}= require('./models/todo');
var {User}= require('./models/user');
var {Book}= require('./models/book');

const {ObjectID} = require('mongodb');
const port = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.json());
//POST
app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.post('/users', (req, res) => {
    var user = new User({
      name: req.body.name,
      email:req.body.email,
      passwd:req.body.passwd,
      adress:req.body.adress,
      userType:req.body.userType
    });
  
    user.save().then((doc) => {
      res.send(doc);
    }, (e) => {
      res.status(400).send(e);
    });
});

app.post('/books', (req, res) => {
    var book = new Book({
      titre: req.body.titre,
      auteur:req.body.auteur,
      prix:req.body.prix
    });
  
    book.save().then((doc) => {
      res.send(doc);
    }, (e) => {
      res.status(400).send(e);
    });
});

//GET
app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});


//DELETE
app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

//UPDATE
app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  })
});

app.listen(port, ()=>{
    console.log( `Server is up on port ${port}`);
})

module.exports={app};   //module.exports.app = app;



/* test du server ok
app.get('/', (req, res) => {
  res.status(404).send({
    error: 'Page not found.',
    name: 'Test node v1.0'
  });
});

//GET /users
app.get('/users', (req, res) => {
  res.send([{
    name: 'Miriam',
    age: 25
  }, {
    name: 'Moussa',
    age: 26
  }]);
});
*/

