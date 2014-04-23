var _ = require('underscore');
var neo4j = require("neo4j");
var db = new neo4j.GraphDatabase('http://localhost:7474');

exports.getRandomPhotos = function(callback) {
  var query = [
  'MATCH (p:Photo)',
  'OPTIONAL MATCH (p)-[:HAS_TAG]->(t)',
  'WITH p, collect(t.name) as t',
  'WITH p,t, rand() as random',
  'RETURN p.fileName as fileName, p.directory as directory, t as tags',
  'ORDER BY random',
  'LIMIT 50'
  ].join('\n');

  // var params = {
  //   userId: currentUser.id
  // };
  db.query(query, {}, function (err, results) {
    console.log("p" + JSON.stringify(results));
    if (err) throw err;
    var photos = results;
    
    _.each(photos, function(photo) {
      photo.thumbnailUrl = photo.fileName.replace(".JPG", "_t.JPG").replace(".jpg", "_t.jpg");
      photo.fileName = photo.fileName.replace(".JPG", "_b.JPG").replace(".jpg", "_b.jpg");
    });

    callback(photos);
  });
};