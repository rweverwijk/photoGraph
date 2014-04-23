var galleryApp = angular.module('galleryApp', []);

galleryApp.controller('PhoneListCtrl', function ($scope, $http) {
  $http.get('/photo/').success(function(data) {
    $scope.phones = data;
  });
});

