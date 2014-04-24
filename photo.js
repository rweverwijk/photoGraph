var _ = require('underscore');
var neo4j = require("neo4j");
var db = new neo4j.GraphDatabase('http://localhost:7474');

exports.getRandomPhotos = function(options, callback) {
  var queryPartial = [
  'MATCH (p:Photo)',
  'WITH p',
  'MATCH (p)-[:HAS_TAG]->(t)',
  'WITH p, collect(t.name) as t',
  'WITH p,t, rand() as random',
  'RETURN p.fileName as fileName, p.directory as directory, t as tags',
  'LIMIT 90'
  ];
  var ordering = 'ORDER BY fileName';
  if (options.order && options.order === "random") {
    ordering = 'ORDER BY random';
  }
  queryPartial.splice(6,0, ordering);  

  if (options.tags) {
    var tagArray = [].concat(options.tags);
    _.each(tagArray, function(item) {
      queryPartial.splice(1,0, ', (p)-[:HAS_TAG]->(`' + item + '` {name: "' + item + '"})');      
    });
  }

  var query = queryPartial.join('\n');
  console.log(query);

  // var params = {
  //   order: options.order ? options.order : "random"
  // };
  db.query(query, {}, function (err, results) {
    //console.log("p" + JSON.stringify(results));
    if (err) throw err;
    var photos = results;
    
    _.each(photos, function(photo) {
      photo.thumbnailUrl = photo.fileName.replace(".JPG", "_t.JPG").replace(".jpg", "_t.jpg");
      photo.fileName = photo.fileName.replace(".JPG", "_b.JPG").replace(".jpg", "_b.jpg");
    });

    callback(photos);
  });
};

exports.getTags = function(callback) {
  var query = [
  'MATCH (t:Tag)',
  'RETURN t.name as name',
  'ORDER BY name'
  ].join('\n');

  db.query(query, {}, function (err, results) {
    console.log("p" + JSON.stringify(results));
    if (err) throw err;
    callback(results);
  });
};