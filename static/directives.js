var galleryApp = angular.module('galleryApp');

galleryApp.directive('gallery', ['$http', '$timeout', function($http, $timeout) {
    return {
      restrict: 'A',
      templateUrl: 'views/galleryItem.html',
      // scope: {
      //   phones: '='
      // },
      link: function($scope, $element, $attrs) {
        $timeout(function(){
        $element.justifiedGallery({
          rowHeight : 250,
          lastRow : 'nojustify',
          margins : 3});
        $element.find('a.gallery').colorbox({rel:'group1'});
      }, 300);
      }
    };
  }]);