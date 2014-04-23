var galleryApp = angular.module('galleryApp', []);

galleryApp.controller('PhotoListCtrl', function ($scope, $http) {
  $http.get('/photo/').success(function(data) {
    $scope.phones = data;
  });
});

