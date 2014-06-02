'use strict';

namespace('Soi.Entities');

Soi.Entities.Shield = function (game) {
  var that = this;
  Phaser.Sprite.call(this, game, 0, 0, 'shieldbar');
  this.health = 100;
  this.maxHealth = 100;
  this.fixedToCamera = true;
  this.cameraOffset.x = 10;
  this.cameraOffset.y = 10;
  this.game.world.add(this);
  that.game.shield = this;
};

Soi.Entities.Shield.prototype = Object.create(Phaser.Sprite.prototype);
Soi.Entities.Shield.prototype.constructor = Soi.Entities.Shield;

Soi.Entities.Shield.prototype.update = function () {
  this.width = this.health * 2;
  this.crop();
};