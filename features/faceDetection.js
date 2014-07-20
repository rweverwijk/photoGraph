var opencv = require('opencv');
var async = require('async');
var photo = require("../photo.js");
var constants = require('../constants.js');
var _ = require('underscore');

var HAARCASCADES = {
  FACE_PROFILE: "./haarCascades/haarcascade_profileface.xml",
  FACE_FRONTAL_DEFAULT: "./haarCascades/frontalFace10/haarcascade_frontalface_default.xml",
  FACE_FRONTAL_ALT: "./haarCascades/frontalFace10/haarcascade_frontalface_alt.xml",
  FACE_FRONTAL_ALT_2: "./haarCascades/frontalFace10/haarcascade_frontalface_alt2.xml",
  FACE_FRONTAL_ALT_TREE: "./haarCascades/frontalFace10/haarcascade_frontalface_alt_tree.xml",
  BODY_FULL: "./haarCascades/body10/haarcascade_fullbody.xml",
  BODY_UPPER: "./haarCascades/body10/haarcascade_upperbody.xml",
};

runHaarCascade = function(im, haarCascade, color, aggregator) {
  console.log("runHaarCascade");
  im.detectObject(haarCascade, {}, function(err, faces){
    for (var i=0;i<faces.length; i++){
      var x = faces[i];
      var percentOfTotal = ((x.height * x.width) * 100 / (im.width() * im.height()));
      console.log("found face!" + x.x + " " + x.y + " " + x.height + " " + x.width + " percentOfTotal: " + percentOfTotal);
      // im.ellipse(x.x + x.width/2, x.y + x.height/2, x.width/2, x.height/2);
      if (percentOfTotal > 0.4) {
        im.rectangle([x.x, x.y], [x.x + x.width, x.y + x.height], color, 5);  
      } else {
        im.rectangle([x.x, x.y], [x.x + x.width, x.y + x.height], [0,0,0,0], 2);  
      }
    }
    aggregator(null,null);
  });
};

detectObjectInImage = function(photo,im, callback) {
  async.series(
    [
      function(aggregator) {
        runHaarCascade(im, HAARCASCADES.FACE_PROFILE, [150,150,0, 50], aggregator);
      },
      function(aggregator) {
        runHaarCascade(im, HAARCASCADES.FACE_FRONTAL_DEFAULT, [0,0,254, 50], aggregator);
      },
      function(aggregator) {
        runHaarCascade(im, HAARCASCADES.BODY_UPPER, [0,254,0, 50], aggregator);
      },

    ], function(err,results) {
      var faceUrl = './faces/' + photo.fileName;
      im.save(faceUrl);
      console.log("done writing: " + faceUrl);
      callback();
    }
  );  
};

detectFaces = function(photos) {
  async.eachSeries(photos, function(photo, callback) {
    console.log("searching face in: " + photo.location);
    opencv.readImage(constants.photoRootDir + photo.location, function(err, im){
      detectObjectInImage(photo,im,callback);    
    });
  });
};

photo.getAllPhotos(detectFaces);