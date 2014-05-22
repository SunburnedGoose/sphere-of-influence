'use strict';

namespace('Soi.Entities');

Soi.Entities.AsteroidField = function(game, field) {
	Phaser.Group.call(this, game);
	
	this.name = 			field.base.name;
  	this.enableBody = 		true;
 	this.physicsBodyType = 	Phaser.Physics.P2JS;
	this.asteroid = [];
	for (var i = 0; i < field.asteroids.length; i++) {
		this.asteroid[i] = 		new Soi.Entities.Asteroid(game, field, i);
		this.add(this.asteroid[i]);
	}
};

Soi.Entities.AsteroidField.prototype = Object.create(Phaser.Group.prototype);
Soi.Entities.AsteroidField.prototype.constructor = Soi.Entities.AsteroidField;


Soi.Entities.AsteroidField.prototype.out = function(){

};

Soi.Entities.AsteroidField.prototype.update = function () {

};