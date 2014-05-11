'use strict';

namespace('Soi.Entities');

Soi.Entities.Asteroid = function(game, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'asteroid');

  this.anchor.setTo(0.5, 0.5);
  this.game.physics.p2.enable(this, true);

  this.body.clearShapes();

  var c = this.body.addCircle(this.width / 2, 0, 0);
  c.sensor = true;

  this.checkWorldBounds = true;
  this.events.onOutOfBounds.add(this.out, this);

  this.body.velocity.y = 50 + Math.random() * 2;
  this.body.velocity.x = 50 + Math.random() * 2;

  this.body.onBeginContact.add(this.onEnterAsteroid, this);
  this.body.onEndContact.add(this.onExitAsteroid , this);
};

Soi.Entities.Asteroid.prototype = Object.create(Phaser.Sprite.prototype);
Soi.Entities.Asteroid.prototype.constructor = Soi.Entities.Asteroid;

Soi.Entities.Asteroid.prototype.onEnterAsteroid = function(targetBody) {
  if (!_.isEmpty(targetBody.sprite)) {
    targetBody.sprite.withinAsteroid = this;
  }
};

Soi.Entities.Asteroid.prototype.onExitAsteroid = function(targetBody) {
  if (!_.isEmpty(targetBody.sprite)) {
    targetBody.sprite.withinAsteroid = undefined;
  }
};

Soi.Entities.Asteroid.prototype.out = function(){
  this.reset(this.x, this.game.world.randomX);
  this.body.velocity.y = 50 + Math.random() * 2;
  this.body.velocity.x = 50 + Math.random() * 2;
};

Soi.Entities.Asteroid.prototype.update = function () {
  this.angle +=  3;
};

Object.defineProperty(Soi.Entities.Asteroid.prototype, 'center', {
  get: function() {
    if (this) {
      if (this.body) {
        return new Phaser.Point(this.x, this.y);
      } else {
        return new Phaser.Point(this.x + (this.width / 2), this.y + (this.height / 2));
      }
    } else {
      return new Phaser.Point(this.x, this.y);
    }
  },
  set: function(value) {
    if (this.body) {
      this.x = value.x;
      this.y = value.y;
    } else {
      this.x = value.x - (this.width / 2);
      this.y = value.y - (this.height / 2);
    }
  }
});