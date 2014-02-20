'use strict';

angular.module('sphereOfInfluenceApp')
  .directive('soiCelestialBody', ['soiFunctionService', '$window', function (funcs, $window) {
    return {
      'requires': '^soiCelestialSphere',
      'templateUrl': 'templates/soiCelestialBody.html',
      'restrict': 'EA',
      'controller': ['$scope', function($scope) {
        $scope.celestialBody.soiRadius = funcs.hillSphereRadius($scope.celestialBody);
        $scope.viewportRatio = funcs.viewportRatio;
      }],
      'link': function postLink(scope, element) {
        function sizeElements(delta) {
          delta = delta || 1;

          var radius = scope.celestialBody.soiRadius * delta;
          var coordinates = [scope.celestialBody.coordinates[0] * delta, scope.celestialBody.coordinates[1] * delta];

          return {
            'element': {
              'left': Math.floor(coordinates[0] - (radius / 2)),
              'top': Math.floor(coordinates[1] - (radius / 2)),
              'width': Math.floor(radius),
              'height': Math.floor(radius)
            },
            'body': {
              'width': Math.floor(radius * 0.2),
              'height': Math.floor(radius * 0.2),
              'borderRadius': Math.floor(radius * 0.1),
              'boxShadow': {
                'one': Math.floor(radius * 0.03),
                'two': Math.floor(radius * 0.03),
                'three': Math.floor(radius * 0.12),
                'four': Math.floor(radius * 0.2),
                'five': Math.floor(radius * 0.01)
              }
            }
          };
        }

        function resizeElements(ratio) {
          var s = sizeElements(ratio);

          element.css('left', s.element.left);
          element.css('top', s.element.top);
          element.css('width', s.element.width + 'px');
          element.css('height', s.element.height + 'px');

          var body = element.find('.celestial-body');
          body.css('width', s.body.width + 'px');
          body.css('height', s.body.height + 'px');
          body.css('border-radius', s.body.borderRadius + 'px');
          body.css('box-shadow', '#000 ' + s.body.boxShadow.one + 'px ' + s.body.boxShadow.two + 'px ' + s.body.boxShadow.three + 'px 0 inset, rgba(255,150,0,0.7) 0 0 ' + s.body.boxShadow.four + 'px ' + s.body.boxShadow.five + 'px');
        }

        $( window ).resize(function() {
          var viewportRatio = funcs.viewportRatio();
          var ratio = (viewportRatio.horizontal < viewportRatio.vertical) ? viewportRatio.horizontal : viewportRatio.vertical;

          resizeElements(ratio);
        });

        var viewportRatio = funcs.viewportRatio();
        var ratio = (viewportRatio.horizontal < viewportRatio.vertical) ? viewportRatio.horizontal : viewportRatio.vertical;

        resizeElements(ratio);

        scope.$watch('viewportRatio()', function(viewportRatio) {
          if (!_.isEmpty(viewportRatio)) {
            var ratio = (viewportRatio.horizontal < viewportRatio.vertical) ? viewportRatio.horizontal : viewportRatio.vertical;
            resizeElements(ratio);
          }
        }, true);
      }
    };
  }]);
