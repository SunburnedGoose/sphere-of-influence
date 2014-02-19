/*global _ */

'use strict';

angular.module('sphereOfInfluenceApp')
  .service('soiFunctionService', function soiFunctionService() {
    var getPositionAtCenter = function (element) {
      var data = element.getBoundingClientRect();
      return {
        x: data.left + data.width / 2,
        y: data.top + data.height / 2
      };
    };

    var pythagDistance = function(a,b) {
      var aPosition, bPosition = [0,0];

      if (_.isElement(a)) {
        aPosition = getPositionAtCenter(a);
      }

      if (_.isElement(b)) {
        bPosition = getPositionAtCenter(b);
      }

      return Math.sqrt(
        Math.pow(aPosition.x - bPosition.x, 2) +
        Math.pow(aPosition.y - bPosition.y, 2)
      );
    };

    function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
      var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

      return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
      };
    }

    function describeArc(x, y, radius, startAngle, endAngle) {

      var start = polarToCartesian(x, y, radius, endAngle);
      var end = polarToCartesian(x, y, radius, startAngle);

      var arcSweep = endAngle - startAngle <= 180 ? '0' : '1';

      var d = [
        'M', start.x, start.y,
        'A', radius, radius, 0, arcSweep, 0, end.x, end.y
      ].join(' ');

      return d;
    }

    return {
      'describeArc': describeArc,
      'pythagDistance': pythagDistance
    };
  });
