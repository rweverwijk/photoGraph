var exif = require('exif2');
var walk = require('walker');
var _ = require('underscore');
var _str = require("underscore.string");
var CSV = require('csv-string');
var constants = require('./constants.js');

var count = 0;
var paths = [];
var running = true;

process.stdout.write(CSV.stringify(["fileName","directory","exposure","fNumber","iso","focalLength","camera","lens","dateCreated"]));
walk(constants.photoRootDir)
    .on('file', function(file, stat) {
        // console.log("Walk " + JSON.stringify(stat) + " file: " + file);
        // Add this file to the list of files
        if (isImage(file.toLowerCase())) {
            paths.push(file);
        }
    })
    .on('end', function() {
        running = false;
        for (var i = 0; i < 50; i++) {
            printExif();    
        }
    });

var printExif = function() {
    count = count +1;
    // console.log(count);
    try {
        var path = paths.pop();
        if (path) {
            exif(path, function(err, obj){
                var sub = {
                    fileName : obj["file name"],
                    directory: obj["directory"].replace(constants.photoRootDir, ''),
                    exposure: obj["exposure time"],
                    fNumber: obj["f number"],
                    iso: obj["iso"],
                    focalLength: obj["focal length"],
                    camera: obj["camera model name"],
                    lens: obj["lens id"],
                    dateCreated: obj["date time original"]
                };
                _.each(obj, function(prop) {
                    if(!prop) {
                        console.error("Not all properties are set");
                    }
                });
                process.stdout.write(CSV.stringify(sub));
                // console.log(sub);
                // console.log(obj);
                if(err) { console.log(err);}
                printExif();
            });         
        }
    } catch(err) {
        console.error(err);
    }
};

var isImage = function(path) {
    return (_str.endsWith(path, "jpg") && !_str.include(path, "iphoto")); //|| _str.endsWith(path, "CR2")
};