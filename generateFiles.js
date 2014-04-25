var exif = require('exif2');
var walk = require('walker');
var _ = require('underscore');
var _str = require("underscore.string");
var CSV = require('csv-string');
var constants = require('./constants.js');
var path = require('path');

process.stdout.write(CSV.stringify(["fileName","directory"]));
walk(constants.photoRootDir)
.on('file', function(file, stat) {
    // console.log("Walk " + JSON.stringify(stat) + " file: " + file);
    // Add this file to the list of files
    if (isImage(file.toLowerCase())) {
        process.stdout.write(path.basename(file) + "," + path.dirname(file) + "\n");  
    }
});

var isImage = function(path) {
    return (_str.endsWith(path, "jpg") && !_str.include(path, "iphoto")); //|| _str.endsWith(path, "CR2")
};