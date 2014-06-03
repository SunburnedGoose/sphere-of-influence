'use strict';

namespace('Soi');
namespace('Soi.Math');

Soi.Math.distanceBetween = function (source, target) {
  var dx = source.x - target.x;
  var dy = source.y - target.y;

  return Math.sqrt(dx * dx + dy * dy);
};

Soi.Math.angleBetween = function (x1, y1, x2, y2) {
  return Soi.Math.angleBetweenPoints(new Phaser.Point(x1, y1), new Phaser.Point(x2, y2));
};

Soi.Math.angleBetweenPoints = function (source, target) {
  return Phaser.Math.angleBetweenPoints(source, target) + (3 / 2 * Math.PI);
};