var galleryApp = angular.module('galleryApp', []);

galleryApp.controller('PhotoListCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
  $scope.fetchPhotos = function() {
    var tagNames = _.map(_.filter($scope.tags, function(item) {return item.selected;}), function(item) {return item.name;});
    var photoUrl = '/photo/?order=' + ($scope.random ? "random" : "file") + (tagNames.length > 0 ? '&tag=' + tagNames.join("&tag=") : '');
    $http.get(photoUrl).success(function(data) {
      $scope.phones = data;
    });  
  };
  
  $scope.fetchTags = function() {
    $http.get('/tags/').success(function(data) {
      $scope.tags = data;
    });  
  };

  $scope.fetchTags();
  $scope.fetchPhotos();
  
}]);

