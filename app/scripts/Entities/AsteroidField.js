'use strict';

namespace('Soi.Entities');

Soi.Entities.AsteroidField = function(game, x, y) {
	Phaser.Group.call(this, game);
	this.asteroid = new Soi.Entities.Asteroid(game, 1450, 1450, 10);
	

  // for (var i = 0; i < this.asteroidCount; i++) {
  //   var as = new Soi.Entities.Asteroid(this.game, this.game.world.randomX, this.game.world.randomY);
  //   as.name = 'asteroid' + i;
  //   this.asteroidsGroup.add(as);
  //   this.dangers.asteroids.push(as);
  //   as.body.setCollisionGroup(this.collisionGroups.asteroids);

  //   this.player.body.collides(this.collisionGroups.asteroids);
  //   as.body.collides(this.collisionGroups.players);
  // }
};

Soi.Entities.AsteroidField.prototype = Object.create(Phaser.Group.prototype);
Soi.Entities.AsteroidField.prototype.constructor = Soi.Entities.AsteroidField;


Soi.Entities.AsteroidField.prototype.out = function(){

};

Soi.Entities.AsteroidField.prototype.update = function () {

};