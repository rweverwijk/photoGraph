var opencv = require('opencv');

opencv.readImage("/Users/rvanweverwijk/projects/rweverwijk/photoGraph/original/IMG_4443.jpg", function(err, im){
  im.detectObject(opencv.FACE_CASCADE, {}, function(err, faces){
    for (var i=0;i<faces.length; i++){

      var x = faces[i];
      console.log("found face!" + x.x + " " + x.y + " " + x.height + " " + x.width);
      // im.ellipse(x.x + x.width/2, x.y + x.height/2, x.width/2, x.height/2);
      im.rectangle([x.x, x.y], [x.x + x.width, x.y + x.height], [150,150,0, 50], 5);
    }
    im.save('./thumbnail/IMG_4443.jpg');
  });
});