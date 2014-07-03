'use strict';

namespace('Soi.Bodies');

Soi.Bodies.getNearestBody = function(center, bodies) {
  var nearestBody = _.min(bodies, function(body) {
    return Phaser.Math.distance(center.center.x, center.center.y, body.center.x, body.center.y);
  });

  return nearestBody;
};
