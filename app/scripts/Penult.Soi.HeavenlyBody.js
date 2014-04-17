'use strict';

Penult.Soi.HeavenlyBody = function (game, instance) {
  this.game = game;
  this.instance = instance;
  this.sprite = undefined;
  this.radius = undefined;
  this.diameter = undefined;
  this.center = undefined;
  this.hasGravityWell = false;
  this.gravityWell = undefined;
};

Penult.Soi.HeavenlyBody.prototype = {};

Penult.Soi.HeavenlyBody.prototype.create = function(position, texture, hasGravityWell) {
  this.sprite = this.game.add.sprite(position.x, position.y, texture);
  this.sprite.scale.setTo(0.2, 0.2);
  this.diameter = this.sprite.width;
  this.radius = this.diameter / 2;

  //this.game.physics.p2.enable([this.sprite]);
  //this.sprite.body.static = true;

  if (hasGravityWell) {
    this.hasGravityWell = hasGravityWell;
    this.gravityWell = new Penult.Soi.GravityWell(this.game, this.instance);
    var hbCenter = this.instance.Utilities.getCenterPoint(this.sprite);
    var gwPosition = new Phaser.Point(hbCenter.x, hbCenter.y);

    this.gravityWell.create(gwPosition, 'gravityWell', this.diameter * 3);

    this.sprite.bringToTop();
  }
};

Penult.Soi.HeavenlyBody.prototype.update = function () {
  var that = this;

  this.gravityWell.update();

  if (!that.center) {
    that.center = this.instance.Utilities.getCenterPoint(that.sprite);
  }
};