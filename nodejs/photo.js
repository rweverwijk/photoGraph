var _ = require('underscore');
var neo4j = require("node-neo4j");
var db = new neo4j('http://neo4j:test@localhost:7474');

exports.getRandomPhotos = function(options, callback) {
  var queryPartial = [
  'MATCH (p:Photo)',
  'WITH p',
  'MATCH (p)-[:HAS_TAG]->(t)',
  'WITH p, collect(t.name) as t',
  'WITH p,t, rand() as random',
  'RETURN p.fileName as fileName, p.directory as directory, t as tags, random',
  'LIMIT 180'
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

  db.cypherQuery(query, {}, function (err, results) {
    
    if (err) throw err;
    var photos = convertToObjectArray(results);
    photos = transformImageNames(photos);

    callback(photos);
  });
};

exports.getTags = function(callback) {
  var query = [
  'MATCH (t:Tag)',
  'RETURN t',
  'ORDER BY t.name'
  ].join('\n');

  db.cypherQuery(query, {}, function (err, results) {
    console.log("p" + JSON.stringify(results.data));
    if (err) throw err;
    callback(results.data);
  });
};

exports.getAllPhotos = function(callback) {
  var query = [
  'MATCH (p:Photo)',
  'RETURN p.fileName as fileName, p.directory as directory, p.location as location',
  ].join('\n');

  db.cypherQuery(query, {}, function (err, results) {
    if (err) throw err;
    callback(transformImageNames(convertToObjectArray(results)));
  });
};

var convertToObjectArray = function(results) {
  var list = [];
  _.each(results.data, function(photo) {
    var newPhoto = {};
    _.each(photo, function(element, index) {      
      newPhoto[results.columns[index]] = element;
    });
    list.push(newPhoto);
  });
  return list;
};

var transformImageNames = function(photos) {
  return _.each(photos, function(photo) {
    photo.thumbnailUrl = photo.fileName.replace(".JPG", "_t.JPG").replace(".jpg", "_t.jpg");
    photo.fileName = photo.fileName.replace(".JPG", "_b.JPG").replace(".jpg", "_b.jpg");
  });
};