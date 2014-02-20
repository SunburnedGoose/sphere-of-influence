'use strict';

angular.module('sphereOfInfluenceApp')
  .directive('soiCelestialSphere', [function () {
    return {
      'templateUrl': 'templates/soiCelestialSphere.html',
      'restrict': 'EA',
      'transclude': true,
      'link': function postLink(scope, element, attrs) {
        attrs.$observe('barycenterX', function(x) {
          scope.barycenterX = (x) ? +x : element.width() / 2;
        });
        attrs.$observe('barycenterY', function(y) {
          scope.barycenterY = (y) ? +y : 9800;
        });

        if (!element.hasClass('celestial-sphere')) {
          element.addClass('celestial-sphere');
        }
      }
    };
  }]);
