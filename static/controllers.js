var galleryApp = angular.module('galleryApp', []);

galleryApp.controller('PhotoListCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
  $scope.fetchPhotos = function() {
    var tag = _.filter($scope.tags, function(item) {return item.selected;});
    var photoUrl = '/photo/' + (tag.length > 0 ? '?tag=' + tag[0].name : '');
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

