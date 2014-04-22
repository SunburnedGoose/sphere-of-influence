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


}

Penult.Soi.Asteroid.prototype.update = function () {
  this.sprite.angle += 	3;
  this.sprite.y +=  	Math.random()*2;
  this.sprite.x +=		Math.random()*2;
};