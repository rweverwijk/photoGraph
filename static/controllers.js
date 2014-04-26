var galleryApp = angular.module('galleryApp', []);

galleryApp.controller('PhotoListCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
  
  $scope.changeTag = function() {
    var tagNames = _.map(_.filter($scope.tags, function(item) {return item.selected;}), function(item) {return item.name;});

    $location.search('tag', tagNames);
    $scope.random ? $location.search('order', 'random') : $location.search('order', 'file');

    $scope.fetchPhotos();
  };

  $scope.fetchPhotos = function() {
    var tagNames = _.map(_.filter($scope.tags, function(item) {return item.selected;}), function(item) {return item.name;});    

    var photoUrl = '/photo/?order=' + ($scope.random ? "random" : "file") + (tagNames.length > 0 ? '&tag=' + tagNames.join("&tag=") : '');
    $http.get(photoUrl).success(function(data) {
      $scope.photos = data;
    });  
  };
  
  $scope.fetchTags = function() {
    $http.get('/tags/').success(function(data) {
      var tags = [].concat($location.search().tag);
      _.each(data, function(item) {
        if (_.contains(tags, item.name)) {
          item.selected = true;
        }
      });
      $scope.tags = data;
      $scope.fetchPhotos();
    });  
  };

  $scope.fetchTags();
  $scope.random = $location.search().order === "random" ?  true : false;
  
}]);

