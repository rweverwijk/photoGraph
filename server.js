var gm = require('gm');
var fs = require('fs');
var express = require('express');
var _str = require("underscore.string");
//var thumb = require("./thumb.js");

var app = express();
var staticMiddleware = express.static(__dirname + '/public');

var flickrSize = {
  s: {width: 75, height: 75, option: "!"},
  q: {width: 150, height: 150, option: "!"},
  t: {width: 100, height: 100, option: undefined},
  m: {width: 240, height: 240, option: undefined},
  n: {width: 320, height: 320, option: undefined},
  z: {width: 640, height: 640, option: undefined},
  c: {width: 800, height: 800, option: undefined},
  b: {width: 1024, height: 1024, option: undefined}
};

app.get('/', function(req, res){
  res.send('hello world');
});

app.use('/static', express.static(__dirname + '/static'));

app.get('/public/:file', function(req, res, next){
    console.log('about to send restricted file '+ req.params.file);
    var fileName = req.params.file;
    fs.exists("./public/" + fileName, function(exists) {
      if (!exists) {
        console.log('generating thumbail for: ' + fileName);
        var fSize = getFlickrSize(fileName);
        gm(getOriginalFileLocation(fileName))
        .resize(fSize.width, fSize.height, fSize.option)
        .write('/Users/rvanweverwijk/projects/rweverwijk/photonodetest/public/' + fileName, function (err) {
          if (!err) {
            req.url = req.url.replace(/^\/public/, '');
            staticMiddleware(req, res, next);
          }
          if (err) console.error(err);
        });
      } else {
        req.url = req.url.replace(/^\/public/, '');
        staticMiddleware(req, res, next);
      }
    });
    
});

var getFlickrSize = function(fileName) {
  if (fileName.substr(fileName.length - 6, 1) == "_") {
    return flickrSize[fileName.substr(fileName.length - 5, 1)];  
  } else {
    return {width: 500, height: 500};
  }
};

var getOriginalFileLocation = function(fileName) {
  var f = fileName.substr(fileName.length - 6, 1) == "_" ? fileName.substr(0, fileName.length - 6) + ".jpg" : fileName;
  return '/Users/rvanweverwijk/projects/rweverwijk/photonodetest/original/' + f;
};

app.listen(3000);