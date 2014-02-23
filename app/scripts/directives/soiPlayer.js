'use strict';

angular.module('sphereOfInfluenceApp')
  .directive('soiPlayer', [function () {
    return {
      templateUrl: 'templates/soiPlayer.html',
      restrict: 'E',
      link: function postLink(scope, element) {
        function draw() {
          element.css({
            'left': scope.scaling(scope.player.location.x - (scope.player.dimensions.width / 2)),
            'top': scope.scaling(scope.player.location.y - (scope.player.dimensions.height / 2)),
            'width': scope.scaling(scope.player.dimensions.width),
            'height': scope.scaling(scope.player.dimensions.height)
          });
        }

        function init() {
          draw();
        }

        scope.$watch(function () {
          return _.map(scope.player.location, function (value) {
            return value;
          }).concat(_.map(scope.player.dimensions, function (value) {
            return value;
          }));
        }, function() {
          draw();
        }, true);

        scope.$watch('scale', function(n, o) {
          if (n !== o) {
            draw();
          }
        });

        init();
      }
    };
  }]);
