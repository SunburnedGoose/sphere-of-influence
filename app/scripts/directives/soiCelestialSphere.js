'use strict';

angular.module('sphereOfInfluenceApp')
  .directive('soiCelestialSphere', [function () {
    return {
      'templateUrl': 'templates/soiCelestialSphere.html',
      'restrict': 'EA',
      'link': function postLink(scope, element) {
        function draw() {
        }

        function init() {
          if (!element.hasClass('celestial-sphere')) {
            element.addClass('celestial-sphere');
          }

          draw();
        }

        scope.$watch('scale', function(n,o) {
          if (n !== o) {
            draw();
          }
        });

        init();
      }
    };
  }]);
