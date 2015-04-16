var sqlite3 = require('sqlite3');
var express = require('express');
var fs = require('fs');
var mustache = require('mustache');

var db = new sqlite3.Database('./database/forum.db');
var app = express();