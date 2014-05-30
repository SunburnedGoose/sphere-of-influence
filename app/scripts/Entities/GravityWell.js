'use strict';

namespace('Soi.Entities');

Soi.Entities.GravityWell = function(game, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'gravityWell');
};

Soi.Entities.GravityWell.prototype = Object.create(Phaser.Sprite.prototype);
Soi.Entities.GravityWell.prototype.constructor = Soi.Entities.GravityWell;

Object.defineProperty(Soi.Entities.GravityWell.prototype, 'center', {
  get: function() {
    var center;

    if (this) {
      if (this.body) {
        center = new Phaser.Point(this.x, this.y);
      } else {
        center = new Phaser.Point(this.x + (this.width / 2), this.y + (this.height / 2));
      }
    } else {
      center = new Phaser.Point(this.x, this.y);
    }

    return center;
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

Object.defineProperty(Soi.Entities.GravityWell.prototype, 'radius', {
  get: function() {
    return this.width / 2;
  },
  set: function() {
  }
});