var sqlite3 = require('sqlite3');
var express = require('express');
var fs = require('fs');
var mustache = require('mustache');
var request = require('request');
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
  db.all("SELECT users.name, topics.topic, topics.votes, topics.id FROM users INNER JOIN topics ON users.id = topics.user_ID;", {}, function(err, data){
    var topicsArray = [];
    data.forEach(function(e){
      topicsArray.push({"postID": e.id, "postTitle": e.topic, "username": e.name, "postVotes": e.votes});
    });
    var rendered = mustache.render(homepage, {homepagePosts: topicsArray});
    res.send(rendered);
  });
});

//Master Search page -- WORKING
app.get('/search', function(req, res){
  var searchPage = fs.readFileSync('./views/search.html', 'utf8');
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

//Get topics (from search) -- WORKING
app.get('/topics', function(req, res){
  var query = req.query.topic;
  db.all("SELECT * FROM topics WHERE topic LIKE '%" + query + "%';", {}, function(err, data){
    var mustacheResults = fs.readFileSync('./views/topics/results.html', 'utf8');
    var mustacheInfo = [];
    data.forEach(function(e){
      mustacheInfo.push({"topicID": e.id, "postTitle" : e.topic, "postVotes": e.votes});
    });
    var rendered = mustache.render(mustacheResults, {topicInfo: mustacheInfo, searchQuery: query});
    res.send(rendered);
  });
});

// Retrieve html page to create new topic -- WORKING
app.get('/topics/new', function(req, res){
  var newTopic = fs.readFileSync('./views/topics/new.html', 'utf8');
  res.send(newTopic);
});

//Create new topic (coming from topics/new.html) -- WORKING
app.post('/topics', function(req, res){
  db.all("SELECT * FROM users WHERE name='" + req.body.username + "';", {}, function(err, data){
    var userID = data[0].id;
  db.run("INSERT INTO topics (topic, votes, user_ID) VALUES ('" + req.body.threadName + "', 0, " + userID + ");");
  });
  res.redirect('/');
});

//show expanded page for a single topic by ID -- NOT WORKING
app.get('/topics/:id', function(req, res){
  var topicID = req.params.id;
  db.all("SELECT topics.topic, topics.votes, topics.user_ID, comments.comment, comments.user_ID, comments.location FROM topics INNER JOIN comments ON topics.id = comments.topic_ID WHERE topics.id=" + topicID + ";", {}, function(err, data){
    // var topicUserID = data[0].;
    // var commentUserID = data[0].;
    res.send(data);
    // var topicArray = [];
    // data.forEach(function(e){
    //   topicArray.push({"topic": e.topic, "topicAuthor": e.user_ID, "votes": e.votes, "comment": e.comment, "author": e.user_ID, "location": e.location});
    // });
    // var mustacheTopic = fs.readFileSync('./views/topics/show.html', 'utf8');
    // var rendered = mustache.render(mustacheTopic, {expandedTopic: topicArray});
    // res.send(rendered);
  });
});


// app.put('/users/:name', function(req, res){

// });

app.listen(3000, function(){
  console.log("Listening on port 3000");
});
