'use strict';

Penult.Soi.GravityWell = function (game, instance) {
  this.game = game;
  this.instance = instance;
  this.scale = undefined;
  this.sprite = undefined;
  this.radius = undefined;
  this.diameter = undefined;
  this.center = undefined;
  this.accelleration = 4;
};

Penult.Soi.GravityWell.prototype = {};

Penult.Soi.GravityWell.prototype.create = function (position, texture, radius) {
  this.sprite = this.game.add.sprite(position.x, position.y, texture);
  this.scale = radius / 100; // Hardcoded to texture size.
  this.sprite.scale.setTo(this.scale, this.scale);
  this.radius = this.sprite.width / 2;
  this.diameter = this.sprite.width;
  this.sprite.alpha = 0.6;

  this.game.physics.p2.enable([this.sprite]);
};

Penult.Soi.GravityWell.prototype.update = function () {
  var that = this;

  this.sprite.scale.setTo(this.scale, this.scale);

  if (!that.center) {
    that.center = this.instance.Utilities.getCenterPoint(that.sprite);
  }
};