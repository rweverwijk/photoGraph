var neo4j = require("neo4j");
var db = new neo4j.GraphDatabase('http://localhost:7474');

exports.getRandomPhotos = function(callback) {
  var query = [
  'MATCH (p:Photo)',
  'RETURN p',
  'LIMIT 10'
  ].join('\n');

  // var params = {
  //   userId: currentUser.id
  // };
  db.query(query, {}, function (err, results) {
    console.log("p" + results);
    if (err) throw err;
    var photos = results.map(function (result) {
      return result.p._data.data;
    });
    callback(photos);
  });
};