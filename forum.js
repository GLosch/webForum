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

//Homepage aka GET topics -- WORKING
app.get('/', function(req, res){
  var homepage = fs.readFileSync('./views/index.html', 'utf8');
  //add logic to list all topics
  db.all("SELECT users.name, topics.topic, topics.votes FROM users INNER JOIN topics ON users.id = topics.user_ID;", {}, function(err, data){
    var topicsArray = [];
    data.forEach(function(e){
      topicsArray.push({"postTitle": e.topic, "username": e.name, "postVotes": e.votes});
    });
    var rendered = mustache.render(homepage, {homepagePosts: topicsArray});
    res.send(rendered);
  });
});

//Master Search page -- NOT WORKING
app.get('/search', function(req, res){
  var searchPage = fs.readFileSync('./views/search.html', 'utf8');
  // var rendered = mustache.render(searchPage, {name: , id: }); //render something
  res.send(searchPage);
});

//Get user-specific info page (from search) -- WORKING
app.get('/users', function(req, res){
  var username = req.query.username;
  db.all("SELECT * FROM users WHERE name='" + username + "';", function(err, data){
    var userID = data[0].id;
    var name = data[0].name;
    var email = data[0].email;
    db.all("SELECT * FROM topics WHERE user_id=" + userID + ";", function(err, data){
      var mustachePostsVotes = [];
    data.forEach(function(e){
      mustachePostsVotes.push({"posts": e.topic, "votes": e.votes});
    });
    var html = fs.readFileSync('./views/user.html', 'utf8');
    var mustacheUserInfo = {"username": name, "email": email};
    var mustachePostsInfo = [];
    var rendered = mustache.render(html, {userInfo: mustacheUserInfo, userPosts: mustachePostsVotes});
    res.send(rendered);
    });
  });
});

//Get a single topic (from search) -- WORKING
app.get('/topics', function(req, res){
  var query = req.query.topic;
  db.all("SELECT * FROM topics WHERE topic LIKE '%" + query + "%';", {}, function(err, data){
    var mustacheResults = fs.readFileSync('./views/topics/show.html', 'utf8');
    var mustacheInfo = [];
    data.forEach(function(e){
      mustacheInfo.push({"postTitle" : e.topic, "postVotes": e.votes});
    });
    var rendered = mustache.render(mustacheResults, {topicInfo: mustacheInfo, searchQuery: query});
    res.send(rendered);
  });
});

app.get('/posts/:id', function(req, res){
  res.send("hi.");
});

// app.put('/users/:name', function(req, res){

// });

app.listen(3000, function(){
  console.log("Listening on port 3000");
});
