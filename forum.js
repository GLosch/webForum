var sqlite3 = require('sqlite3');
var express = require('express');
var fs = require('fs');
var mustache = require('mustache');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var morgan = require('morgan');

var db = new sqlite3.Database('./database/forum.db');
var app = express();
app.use(morgan('dev'));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: false}));

app.get('/', function(req, res){
  var homepage = fs.readFileSync('./views/index.html', 'utf8');
  res.send(homepage);
});

// app.get('/users/:id', function(req, res){
//   var id = req.params.id;
//   db.all("SELECT * FROM users WHERE id=" + id + ";", {}, function(err, data){
//     var html = fs.readFileSync('./views/user.html', 'utf8');
//     var mustacheInfo = [{"username": data[0].name}, {"email": data[0].email}];
//     var mustachePosts = 
//     var rendered = mustache.render(html, {userInfo: mustacheInfo, userPosts: });
//     console.log(err);
//     console.log(data);
//     res.send(rendered);
//   });
// });

app.get('/users/:id', function(req, res){
  var id = req.params.id;
  db.all("SELECT users.name, users.email, topics.topic, topics.votes FROM users INNER JOIN topics ON users.id = topics.user_ID WHERE users.id=" + id + ";", {}, function(err, data){
    console.log(data);
  });
});

app.listen(3000, function(){
  console.log("Listening on port 3000");
});

// SELECT tableOne.columnToReturn, tableOne.anotherColumntoReturn, tableTwo.columnToReturn
// FROM tableOne 
// INNER JOIN tableTwo
// ON tableOne.columnInQuestion = tableTwo.columnInQuestion;