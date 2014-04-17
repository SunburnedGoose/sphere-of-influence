Penult.Soi.HeavenlyBody = function (game, instance) {
  this.game = game;
  this.instance = instance;
  this.sprite;
  this.radius;
  this.diameter;
  this.center;
  this.hasGravityWell = false;
  this.gravityWell;
}

Penult.Soi.HeavenlyBody.prototype = {};

Penult.Soi.HeavenlyBody.prototype.create = function(position, texture, hasGravityWell) {
  this.sprite = this.game.add.sprite(position.x, position.y, texture);
  this.sprite.scale.setTo(0.4, 0.4);
  this.diameter = this.sprite.width;
  this.radius = this.diameter / 2;

  if (hasGravityWell) {
    this.hasGravityWell = hasGravityWell;
    this.gravityWell = new Penult.Soi.GravityWell(this.game, this.instance);
    var hbCenter = getCenterPoint(this.sprite);
    var gwPosition = new Phaser.Point(hbCenter.x, hbCenter.y);

    this.gravityWell.create(gwPosition, 'gravityWell', this.diameter * 3);

    this.sprite.bringToTop();
  }
}

Penult.Soi.HeavenlyBody.prototype.update = function () {
  var that = this;

  this.gravityWell.update();

  if (!that.center) {
    that.center = getCenterPoint(that.sprite);
  }
};