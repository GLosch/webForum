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
  db.run("INSERT INTO topics (topic, votes, user_ID, location) VALUES ('oh man!', 5, 1, 'Brooklyn, New York');");
  db.run("INSERT INTO topics (topic, votes, user_ID, location) VALUES ('whaaaaat??', 2, 3, 'Dayton, Ohio');");
  db.run("INSERT INTO topics (topic, votes, user_ID, location) VALUES ('Thursdays, amiright?', 12, 2, 'Minneapolis, Minnesota');");
  db.run("INSERT INTO topics (topic, votes, user_ID, location) VALUES ('puppies!', 49, 5, 'Phoenix, Arizona');");
  db.run("INSERT INTO topics (topic, votes, user_ID, location) VALUES ('kittens!', 37, 4, 'Tulsa, Oklahoma');");
  db.run("INSERT INTO topics (topic, votes, user_ID, location) VALUES ('cats suck!', 92, 4, 'Lincoln, Nebraska');");
  db.run("INSERT INTO topics (topic, votes, user_ID, location) VALUES ('why does everyone hate cats?', 19, 1, 'Deerfield, Michigan');");
});

db.serialize(function(){
  db.run("INSERT INTO comments (topic_ID, user_ID, comment, location) VALUES (1, 5, 'I have opinions about things', 'Las Vegas, Nevada');");
  db.run("INSERT INTO comments (topic_ID, user_ID, comment, location) VALUES (2, 4, 'trolling is awesome!', 'Duluth, Minnesota');");
  db.run("INSERT INTO comments (topic_ID, user_ID, comment, location) VALUES (3, 3, 'ron paul 2012!!!', 'Tallahassee, Florida');");
  db.run("INSERT INTO comments (topic_ID, user_ID, comment, location) VALUES (4, 2, 'first! oh wait, no Im not...', 'Boulder, Colorado');");
  db.run("INSERT INTO comments (topic_ID, user_ID, comment, location) VALUES (5, 1, 'Im going to write a novel here...', 'Pittsburgh, Pennsylvania');");
  db.run("INSERT INTO comments (topic_ID, user_ID, comment, location) VALUES (6, 5, 'what are we talking about again?', 'Chicago, Illinois');");
  db.run("INSERT INTO comments (topic_ID, user_ID, comment, location) VALUES (7, 4, 'is this thing on?', 'Portland, Oregon');");
  db.run("INSERT INTO comments (topic_ID, user_ID, comment, location) VALUES (1, 3, 'no longer pretending this is a real comment', 'Portland, Maine');");
  db.run("INSERT INTO comments (topic_ID, user_ID, comment, location) VALUES (2, 1, 'does nobody care about the real issues?', 'Seattle, Washington');");
  db.run("INSERT INTO comments (topic_ID, user_ID, comment, location) VALUES (3, 2, 'wont someone think of the children?!?!', 'Washington, DC');");
});