'use strict';

namespace('Soi.Entities');

Soi.Entities.CelestialBody = function(game, x, y) {
  Phaser.Group.call(this, game);

  this.surface = null;
  this.well = null;
  this.gravity = 9.8;
  this.mass = 10000;

  this.enableBody = true;
  this.physicsBodyType = Phaser.Physics.P2JS;

  var moon = this.game.add.sprite(x, y, 'planetoid');
  moon.scale.setTo(0.3, 0.3);

  var well = new Soi.Entities.GravityWell(this.game, x, y);

  var maxRatio = 600 / well.width;
  var trueRatio = moon.width * 5 / well.width;
  var ratio = (maxRatio > trueRatio) ? trueRatio : maxRatio;

  well.scale.setTo(ratio, ratio);

  this.game.physics.p2.enable([moon, well], false);

  this.add(well);
  this.add(moon);

  moon.body.static = true;
  moon.body.clearShapes();
  moon.body.setCircle(moon.width / 2);

  well.body.static = true;
  well.body.clearShapes();

  var c = well.body.addCircle(well.width / 2, 0, 0);
  c.sensor = true;

  this.surface = moon;
  this.well = well;

  well.body.onBeginContact.add(this.onEnterGravityWell, this);
  well.body.onEndContact.add(this.onExitGravityWell , this);
};

Soi.Entities.CelestialBody.prototype = Object.create(Phaser.Group.prototype);
Soi.Entities.CelestialBody.prototype.constructor = Soi.Entities.CelestialBody;

Soi.Entities.CelestialBody.prototype.onEnterGravityWell = function(targetBody) {
  if (!_.isEmpty(targetBody.sprite)) {
    targetBody.sprite.soi = this;
  }
};

Soi.Entities.CelestialBody.prototype.onExitGravityWell = function(targetBody) {
  if (!_.isEmpty(targetBody.sprite)) {
    targetBody.sprite.soi = undefined;
  }
};

Object.defineProperty(Soi.Entities.CelestialBody.prototype, 'center', {
  get: function() {
    if (this) {
      if (this.surface.body) {
        return new Phaser.Point(this.surface.x, this.surface.y);
      } else {
        return new Phaser.Point(this.surface.x + (this.surface.width / 2), this.surface.y + (this.surface.height / 2));
      }
    } else {
      return new Phaser.Point(this.surface.x, this.surface.y);
    }
  },
  set: function() {
  }
});