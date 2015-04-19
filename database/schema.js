var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./forum.db');

db.serialize(function(){
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR, email VARCHAR);");
});

db.serialize(function(){
  db.run("CREATE TABLE topics (id INTEGER PRIMARY KEY AUTOINCREMENT, topic VARCHAR, votes INTEGER, location VARCHAR, user_ID INTEGER, FOREIGN KEY (user_ID) REFERENCES users(id));");
});

db.run("CREATE TABLE comments (id INTEGER PRIMARY KEY AUTOINCREMENT, topic_ID INTEGER, user_ID INTEGER, comment TEXT, location VARCHAR, FOREIGN KEY (topic_ID) REFERENCES topics(id), FOREIGN KEY (user_ID) REFERENCES users(id));");
