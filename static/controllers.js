var galleryApp = angular.module('galleryApp', []);

galleryApp.controller('PhotoListCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
  var tag = $location.search().tag;
  var url = '/photo/' + (tag ? '?tag=' + tag : '');
  $http.get(url).success(function(data) {
    $scope.phones = data;
  });
}]);

