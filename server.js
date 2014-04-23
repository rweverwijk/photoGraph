var fs = require('fs');
var express = require('express');
var thumb = require("./thumb.js");
var path = require('path');
var photo = require("./photo.js");

var app = express();
var staticMiddleware = express.static(path.join(__dirname + '/thumbnail'));

app.get('/', function(req, res){
  res.send('hello world');
});

app.use('/static', express.static(__dirname + '/static'));

app.get('/thumbnail/:file*', function(req, res, next){
    var fileName = req.params.file + (req.params[0] ? req.params[0] : "");

    var serveFile = function() {
      req.url = req.url.replace(/^\/thumbnail/, '');
      staticMiddleware(req, res, next);
    };
    
    fs.exists("./thumbnail/" + fileName, function(exists) {
      if (!exists) {
        thumb.generateThumbnail(fileName, serveFile);
      } else {
        console.log("serving from disk: " + fileName);
        serveFile();
      }
    });
});

app.get('/photo', function(req, res, next) {
  var tags = req.query.tag;
  var callback = function(photos) { res.send(JSON.stringify(photos));};
  var photos = photo.getRandomPhotos(tags, callback);
});

app.listen(3000);