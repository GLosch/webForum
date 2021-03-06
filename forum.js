var sqlite3 = require('sqlite3');
var express = require('express');
var fs = require('fs');
var mustache = require('mustache');
var request = require('request');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var morgan = require('morgan');
var marked = require('marked');

var db = new sqlite3.Database('./database/forum.db');
var app = express();
app.use(morgan('dev'));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: false}));

//Homepage aka GET topics -- WORKING
app.get('/', function(req, res){
  var homepage = fs.readFileSync('./views/index.html', 'utf8');
  //add logic to list all topics
  db.all("SELECT users.name, topics.topic, topics.votes, topics.id, topics.location FROM users INNER JOIN topics ON users.id = topics.user_ID ORDER BY votes DESC;", {}, function(err, data){
    var topicsArray = [];
    data.forEach(function(e){
      topicsArray.push({"topicID": e.id, "postTitle": e.topic, "username": e.name, "postVotes": e.votes, "location": e.location});
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

//Get user-specific info page (from search) -- WORKING (can improve this by combining the two SQL queries into an INNER JOIN)
app.get('/users', function(req, res){
  var username = req.query.username;
  db.all("SELECT * FROM users WHERE name='" + username + "';", function(err, data){
    var userID = data[0].id;
    var name = data[0].name;
    var email = data[0].email;
    db.all("SELECT * FROM topics WHERE user_id=" + userID + ";", function(err, data){
      var mustachePostsVotes = [];
    data.forEach(function(e){
      mustachePostsVotes.push({"posts": e.topic, "votes": e.votes, "location": e.location});
    });
    var html = fs.readFileSync('./views/user.html', 'utf8');
    var mustacheUserInfo = {"username": name, "email": email};
    var mustachePostsInfo = [];
    var rendered = mustache.render(html, {userInfo: mustacheUserInfo, userPosts: mustachePostsVotes, user_id: userID});
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
  request.get('http://ipinfo.io/', function(err, resp, body){
      var parsed = JSON.parse(body);
      var userLocation = parsed.city + ", " + parsed.region;
  db.all("SELECT * FROM users WHERE name='" + req.body.username + "';", {}, function(err, data){
    var userID = data[0].id;
  db.serialize(function(){
    db.run("INSERT INTO topics (topic, votes, user_ID, location) VALUES ('" + req.body.threadName + "', 0, " + userID + ", '" + userLocation + "');");
      db.serialize(function(){
        db.all("SELECT * FROM topics WHERE topic='" + req.body.threadName + "';", {}, function(err, innerData){
        var topicID = innerData[0].id;
        db.run("INSERT INTO comments (topic_ID, user_ID, comment, location) VALUES (" + topicID + ", " + userID + ", '" + marked(req.body.postBody) + "', '" + userLocation + "');");
          });
      });
  });
  });
  });
  res.redirect('/');
});

//show expanded page for a single topic by ID -- WORKING
app.get('/topics/:id', function(req, res){
  var topicID = req.params.id;
  db.all("SELECT topics.topic, topics.votes, topics.user_ID, comments.comment, comments.user_ID, comments.location, comments.id, users.name FROM topics INNER JOIN comments ON topics.id = comments.topic_ID INNER JOIN users ON comments.user_ID = users.id WHERE topics.id=" + topicID + ";", {}, function(err, data){
    console.log(data);
    var topicArray = [];
    data.forEach(function(e){
      topicArray.push({"topic": e.topic, "topicAuthor": e.name, "votes": e.votes, "comment": e.comment, "author": e.name, "location": e.location, commentID: e.id});
      });
    var mustacheTopic = fs.readFileSync('./views/topics/show.html', 'utf8');
    var rendered = mustache.render(mustacheTopic, {topic: topicArray[0].topic, topicAuthor: topicArray[0].topicAuthor, votes: topicArray[0].votes, expandedTopic: topicArray, topicID: topicID});
    res.send(rendered);
  });
});

//add new comment (comes from topics/show.html) -- WORKING (but needs to refresh the comments before the redirect)
app.post('/topics/:topic_id/comments/new', function(req, res){
  var newComment = req.body.newComment;
  var username = req.body.username;
  var topicID = req.params.topic_id;
  request.get('http://ipinfo.io/', function(err, resp, body){
    var parsed = JSON.parse(body);
  var userLocation = parsed.city + ", " + parsed.region;
  db.all("SELECT * FROM users WHERE name='" + username + "';", {}, function(err, data){
    var userID = data[0].id;
    db.run("INSERT INTO comments (topic_ID, user_ID, comment, location) VALUES (" + topicID + ", " + userID + ", '" + marked(newComment) + "', '" + userLocation + "');");
    });
  });
    res.redirect('/topics/' + req.params.topic_id);
});

app.get('/users/new', function(req, res){
  var newUserPage = fs.readFileSync('./views/users/new.html', 'utf8');
  res.send(newUserPage);
});

//Create new user -- WORKING
app.post('/users/new', function(req, res){
  var username = req.body.username;
  var email = req.body.email;
  db.all("SELECT * FROM users WHERE name='" + username + "';", {}, function(err, data){
    if(!data[0]){
  db.run("INSERT INTO users (name, email) VALUES ('" + username + "', '" + email + "');");
  res.redirect('/');
    } else {
      res.send("That username already exists. Please go back and try a new username.");
    }
  });
});

//delete topic by ID (comes from topics/show.html) -- WORKING
app.delete('/topics/:topic_id', function(req, res){
  var id = req.params.topic_id;
  db.run("DELETE FROM topics WHERE id=" + id + ";");
  db.run("DELETE FROM comments WHERE topic_ID=" + id + ";");
  res.redirect('/');
});

//delete comment by ID (comes from topics/show.html) -- NOT WORKING
app.delete('/topics/:topic_id/comments/:comment_id', function(req, res){
  var id = req.params.comment_id;
  db.run("DELETE FROM comments WHERE id=" + id + ";");
  res.redirect('/topics/' + req.params.topic_id);
});

//delete user by ID (comes from user.html)
app.delete('/users/:user_id', function(req, res){
  var id = req.params.user_id;
  // console.log(req.params.user_id);
  db.run("DELETE FROM users WHERE id=" + id + ";");
  db.run("DELETE FROM topics WHERE user_ID=" + id + ";");
  db.run("DELETE FROM comments WHERE user_ID=" + id + ";");
  res.redirect('/');
});

//UPVOTE topic
app.put('/upvote/topics/:topic_id', function(req, res){
  var id = req.params.topic_id;
  db.run("UPDATE topics SET votes=votes+1 WHERE id=" + id + ";");
  res.redirect('/');
});


app.listen(3000, function(){
  console.log("Listening on port 3000");
});
