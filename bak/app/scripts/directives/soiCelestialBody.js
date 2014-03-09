'use strict';

angular.module('sphereOfInfluenceApp')
  .directive('soiCelestialBody', ['soiFunctionService', function (funcs) {
    return {
      'requires': '^soiCelestialSphere',
      'templateUrl': 'templates/soiCelestialBody.html',
      'restrict': 'EA',
      'controller': ['$scope', function($scope) {
        function init() {
          $scope.celestialBody.hillSphereRadius = funcs.hillSphereRadius($scope.celestialBody);
        }

        init();
      }],
      'link': function postLink(scope, element) {
        function draw() {
          var radius = scope.celestialBody.hillSphereRadius;
          var cb = scope.celestialBody;

          element.css({
            'left': scope.scaling(cb.location.x - (radius / 2)),
            'top': scope.scaling(cb.location.y - (radius / 2)),
            'width': scope.scaling(radius),
            'height': scope.scaling(radius)
          });

          element.find('.celestial-body').css({
            'width': scope.scaling(radius * 0.2),
            'height': scope.scaling(radius * 0.2),
            'border-radius': scope.scaling(radius * 0.1),
            'box-shadow':
              '#000 ' + scope.scaling(radius * 0.03) + 'px ' + scope.scaling(radius * 0.03) + 'px ' + scope.scaling(radius * 0.12) + 'px 0 inset, ' +
              'rgba(255,150,0,0.7) 0 0 ' + scope.scaling(radius * 0.2) + 'px ' + scope.scaling(radius * 0.01) + 'px'
          });
        }

        function init() {
          draw();
        }

        scope.$watch('celestialBody', function(n,o) {
          if (n.radius !== o.radius) {
            scope.celestialBody.hillSphereRadius = funcs.hillSphereRadius(n);
            draw();
          }
        });

        scope.$watch('scale', function(n,o) {
          if (n !== o) {
            draw();
          }
        });

        init();
      }
    };
  }]);
