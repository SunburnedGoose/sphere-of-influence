'use strict';

namespace('Soi.Entities');

Soi.Entities.AsteroidField = function(game, field) {
	Phaser.Group.call(this, game);
	console.log(field);
	this.name = field.base.name;
	
	for (var i = 0; i < field.asteroids.length; i++) {
		this.asteroid = 		new Soi.Entities.Asteroid(game, field, i);
	}
};

Soi.Entities.AsteroidField.prototype = Object.create(Phaser.Group.prototype);
Soi.Entities.AsteroidField.prototype.constructor = Soi.Entities.AsteroidField;


Soi.Entities.AsteroidField.prototype.out = function(){

};

Soi.Entities.AsteroidField.prototype.update = function () {

};