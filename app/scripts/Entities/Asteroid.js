'use strict';

namespace('Soi.Entities');

Soi.Entities.Asteroid = function(game, props) {
  Phaser.Sprite.call(this, game, props.x, props.y, 'asteroid');      
  
  this.asteroid = 			this.game.add.sprite(props.x, props.y, 'asteroid');
  this.asteroid.name = 		this.name+"_asteroid_"+props.count;
  this.scale.x = 			props.size;
  this.scale.y = 			props.size;
  this.asteroid.scale.x = 	props.size;
  this.asteroid.scale.y = 	props.size;
  
  this.asteroid.animations.add('rotate');
  this.asteroid.animations.play('rotate', props.fps, true);
  
  this.anchor.setTo(0.5, 0.5);
  this.game.physics.p2.enable(this, true);

  this.body.clearShapes();

  var c = 		this.body.addCircle(this.width / 2, 30*props.size, 40*props.size);
  c.sensor = 	true;

  this.checkWorldBounds = true;
  this.events.onOutOfBounds.add(this.out, this);



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

Soi.Entities.Asteroid.prototype.out = function(){

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