'use strict';

angular.module('sphereOfInfluenceApp')
  .service('soiFunctionService', ['soiCelestialBodyService', function soiFunctionService(cbs) {
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

    var soiRadius = function(bodyA, bodyB) {
      if (_.isEmpty(bodyB)) {
        bodyB = cbs.sun;
      }

      var majorBody = null;
      var minorBody = null;
      var distance = 0;

      if (bodyB.mass > bodyA.mass) {
        majorBody = bodyB;
        minorBody = bodyA;
      } else {
        majorBody = bodyA;
        minorBody = bodyB;
      }

      if (bodyB.id === 'sun') {
        distance = minorBody.sma;
      } else {
        // TODO
        // Calculate distance between two bodies
        // on the screen.
      }

      var soiRadius = distance * Math.pow((minorBody.mass / majorBody.mass), 0.4);

      return (soiRadius / 9000); // Radius Scale
    };

    var viewport = function() {
      return verge.viewport();
    };

    var viewportRatio = function() {
      var v = viewport();

      return {
        'width': v.width,
        'height': v.height,
        'horizontal': v.width / 1280,
        'vertical': v.height / 720
      };
    };

    return {
      'describeArc': describeArc,
      'pythagDistance': pythagDistance,
      'hillSphereRadius': soiRadius,
      'viewport': viewport,
      'viewportRatio': viewportRatio
    };
  }]);
