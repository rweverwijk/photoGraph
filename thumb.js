var gm = require('gm');
var fs = require('fs');
var path = require('path');

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

exports.generateThumbnail = function(fileName, callback) {
  console.log('generating thumbail for: ' + fileName);
  var fSize = getFlickrSize(fileName);
  var completeFilePath = './thumbnail/' + fileName;
  checkPathExistsOrCreate(completeFilePath);
  gm(getOriginalFileLocation(fileName))
  .resize(fSize.width, fSize.height, fSize.option)
  .write(completeFilePath, function (err) {
    if (!err) {
      callback();
    }
    if (err) console.error(err);
  });
};

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

var checkPathExistsOrCreate = function(completeFilePath) {
  var directory = path.dirname(completeFilePath);
  fs.exists(directory, function(exists) {
    if (!exists) {
      fs.mkdirRecursive(directory);
    }
  });
};

fs.mkdirRecursive = function(dirPath, mode, callback) {
  //Call the standard fs.mkdir
  fs.mkdir(dirPath, mode, function(error) {
    //When it fail in this way, do the custom steps
    if (error && error.errno === 34) {
      //Create all the parents recursively
      fs.mkdirParent(path.dirname(dirPath), mode, callback);
      //And then the directory
      fs.mkdirParent(dirPath, mode, callback);
    }
    //Manually run the callback since we used our own callback to do all these
    callback && callback(error);
  });
};