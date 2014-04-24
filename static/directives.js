var galleryApp = angular.module('galleryApp');

galleryApp.directive('gallery', ['$http', '$timeout', function($http, $timeout) {
    return {
      restrict: 'A',
      templateUrl: 'views/galleryItem.html',
      // scope: {
      //   photos: '='
      // },
      link: function($scope, $element, $attrs) {
        $scope.$watch("photos",function(newValue,oldValue) {
          $timeout(function(){
            $element.justifiedGallery({
              rowHeight : 150,
              lastRow : 'hide', // nojustify, justify, hide
              margins : 3});
            $element.find('a.gallery').colorbox({rel:'group1'});
          }, 300);
        });
      }
    };
  }]);