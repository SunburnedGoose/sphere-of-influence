'use strict';

namespace('Soi.Entities');

Soi.Entities.Asteroid = function(game, field, num) {
  var props =		field.asteroids[num];

  Phaser.Sprite.call(this, game, props.x, props.y, 'asteroid');

<<<<<<< HEAD
  this.name =		field.base.name+'_asteroid_'+num;
  this.scale.x =	props.size;
  this.scale.y =	props.size;
=======
  this.name = 		field.base.name+"_asteroid_"+num;
  this.scale.x = 	props.size;
  this.scale.y = 	props.size;
>>>>>>> d6e8ca84e061fc17e3be4a01938ce357c94fa931

  this.animations.add('rotate');
  this.animations.play('rotate', props.fps, true);

  this.anchor.setTo(0.5, 0.5);
  this.game.physics.p2.enable(this, false);

  this.body.static = true;
  this.body.clearShapes();

<<<<<<< HEAD
  var c =		this.body.addCircle(this.width / 2, props.size, props.size);
  c.sensor =	true;

  var gameState = this.game.state.states[this.game.state.current];

=======
  var c = 		this.body.addCircle(this.width / 2, props.size, props.size);
  c.sensor = 	true;

  var gameState = this.game.state.states[this.game.state.current];

>>>>>>> d6e8ca84e061fc17e3be4a01938ce357c94fa931
  this.body.setCollisionGroup(gameState.collisionGroups.asteroids);
  this.body.collides(gameState.collisionGroups.players);

  this.body.onBeginContact.add(this.onEnterAsteroid, this);
  this.body.onEndContact.add(this.onExitAsteroid , this);
};

Soi.Entities.Asteroid.prototype = Object.create(Phaser.Sprite.prototype);
Soi.Entities.Asteroid.prototype.constructor = Soi.Entities.Asteroid;

Soi.Entities.Asteroid.prototype.onEnterAsteroid = function(targetBody) {
  if (!_.isEmpty(targetBody.sprite)) {
    targetBody.sprite.withinAsteroid = this;
  }
};

Soi.Entities.Asteroid.prototype.onExitAsteroid = function(targetBody) {
  if (!_.isEmpty(targetBody.sprite)) {
    targetBody.sprite.withinAsteroid = undefined;
  }
};


Soi.Entities.Asteroid.prototype.update = function () {

};

Object.defineProperty(Soi.Entities.Asteroid.prototype, 'center', {
  get: function() {
    if (this) {
      if (this.body) {
        return new Phaser.Point(this.x, this.y);
      } else {
        return new Phaser.Point(this.x + (this.width / 2), this.y + (this.height / 2));
      }
    } else {
      return new Phaser.Point(this.x, this.y);
    }
  },
  set: function(value) {
    if (this.body) {
      this.x = value.x;
      this.y = value.y;
    } else {
      this.x = value.x - (this.width / 2);
      this.y = value.y - (this.height / 2);
    }
  }
});