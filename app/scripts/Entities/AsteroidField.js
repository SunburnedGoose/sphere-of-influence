'use strict';

namespace('Soi.Entities');

Soi.Entities.AsteroidField = function(game, group, x, y) {
	Phaser.Group.call(this, game);
	this.name = group;
	var count = 2;
	var props = new Array();
	
	props[0] = {
		count:  1,
		fps:	(Math.floor(Math.random() * 20) + 1),
		size: 	1,
		x: 		x+5,
		y: 		y+5,
	},
	props[1] = {
		count:  1,
		fps:	(Math.floor(Math.random() * 20) + 1),
		size: 	.5,
		x: 		x+100,
		y: 		y+5,
	}
	for (var i = 0; i < count; i++) {
		this.asteroid = 		new Soi.Entities.Asteroid(game,  props[i]);
	}
};

Soi.Entities.AsteroidField.prototype = Object.create(Phaser.Group.prototype);
Soi.Entities.AsteroidField.prototype.constructor = Soi.Entities.AsteroidField;


Soi.Entities.AsteroidField.prototype.out = function(){

};

Soi.Entities.AsteroidField.prototype.update = function () {

};