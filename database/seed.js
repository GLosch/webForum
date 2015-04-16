var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./forum.db');

db.serialize(function(){
  db.run("INSERT INTO users (name, email) VALUES ('John', 'John@stuff.com');");
  db.run("INSERT INTO users (name, email) VALUES ('Sean', 'sean@stuff.com');");
  db.run("INSERT INTO users (name, email) VALUES ('Eric', 'eric@stuff.com');");
  db.run("INSERT INTO users (name, email) VALUES ('Anna', 'anna@stuff.com');");
  db.run("INSERT INTO users (name, email) VALUES ('Julia', 'julia@stuff.com');");
});

db.serialize(function(){
  db.run("INSERT INTO topics (topic, votes, user_ID) VALUES ('oh man!', 5, 1);");
  db.run("INSERT INTO topics (topic, votes, user_ID) VALUES ('whaaaaat??', 2, 3);");
  db.run("INSERT INTO topics (topic, votes, user_ID) VALUES ('Thursdays, amiright?', 12, 2);");
  db.run("INSERT INTO topics (topic, votes, user_ID) VALUES ('puppies!', 49, 5);");
  db.run("INSERT INTO topics (topic, votes, user_ID) VALUES ('kittens!', 37, 4);");
  db.run("INSERT INTO topics (topic, votes, user_ID) VALUES ('cats suck!', 92, 4);");
  db.run("INSERT INTO topics (topic, votes, user_ID) VALUES ('why does everyone hate cats?', 19, 1);");
});

db.serialize(function(){
  db.run("INSERT INTO comments (topic_ID, user_ID, comment) VALUES (1, 5, 'I have opinions about things');");
  db.run("INSERT INTO comments (topic_ID, user_ID, comment) VALUES (2, 4, 'trolling is awesome!');");
  db.run("INSERT INTO comments (topic_ID, user_ID, comment) VALUES (3, 3, 'ron paul 2012!!!');");
  db.run("INSERT INTO comments (topic_ID, user_ID, comment) VALUES (4, 2, 'first! oh wait, no Im not...');");
  db.run("INSERT INTO comments (topic_ID, user_ID, comment) VALUES (5, 1, 'Im going to write a novel here...');");
  db.run("INSERT INTO comments (topic_ID, user_ID, comment) VALUES (6, 5, 'what are we talking about again?');");
  db.run("INSERT INTO comments (topic_ID, user_ID, comment) VALUES (7, 4, 'is this thing on?');");
  db.run("INSERT INTO comments (topic_ID, user_ID, comment) VALUES (1, 3, 'no longer pretending this is a real comment');");
  db.run("INSERT INTO comments (topic_ID, user_ID, comment) VALUES (2, 1, 'does nobody care about the real issues?');");
  db.run("INSERT INTO comments (topic_ID, user_ID, comment) VALUES (3, 2, 'wont someone think of the children?!?!');");
});