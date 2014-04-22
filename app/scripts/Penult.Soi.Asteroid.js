Penult.Soi.Asteroid = function (game, instance) {
  this.game = game;
  this.instance = instance;
  this.sprite;
  this.radius;
  this.diameter;
  this.center;
}

Penult.Soi.Asteroid.prototype = {};

Penult.Soi.Asteroid.prototype.create = function(position, texture) {
  this.sprite = 	this.game.add.sprite(position.x, position.y, texture);
  this.sprite.anchor.setTo(0.5, 0.5);
  this.sprite.checkWorldBounds = true;
  this.sprite.events.onOutOfBounds.add(Penult.Soi.Asteroid.prototype.out, this);
  this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE)
  this.sprite.body.velocity.y = 50 + Math.random() * 2;
  this.sprite.body.velocity.x = 50 + Math.random() * 2;
}

Penult.Soi.Asteroid.prototype.out = function(){
    this.sprite.reset(this.sprite.x, this.game.world.randomX);
    this.sprite.body.velocity.y = 50 + Math.random() * 2;
    this.sprite.body.velocity.x = 50 + Math.random() * 2;
}

Penult.Soi.Asteroid.prototype.update = function () {
  this.sprite.angle += 	3;
};