/*global soi:false */
'use strict';

Penult.Soi.Ship = function (game, instance) {
  this.game = game;
  this.instance = instance;
  this.sprite = undefined;
  this.rotationSpeed = 10;
  this.thrusting = false;
  this.center = undefined;
  this.inSoi = false;
  this.planet = null;
  this.__tweeningCameraToShip = false;
};

Penult.Soi.Ship.prototype = {};

Penult.Soi.Ship.prototype.create = function (position, texture) {
  var that = this;
  this.sprite = this.game.add.sprite(position.x, position.y, texture);

  this.game.physics.p2.enable([this.sprite]);
  //this.sprite.body.kinematic = true;

  //this.sprite.scale.setTo(0.25, 0.25);
  this.sprite.animations.add('forward',[1,2,3,4,5,6],6,true);
  this.sprite.animations.add('reverse',[7,8,9,10],4,true);
  this.sprite.animations.add('unpowered',[0],0,false);
  this.sprite.animations.play('unpowered');

  this.game.input.onDown.add(function(a) {
    that.changeVector(a, that);
  });
  this.game.input.onHold.add(function(a) {
    that.changeVector(a, that);
  });
};

Penult.Soi.Ship.prototype.changeVector = function(a, that) {
  //ship.body.velocity.x = ship.body.velocity.y = 0;
  var x1 = 400;
  var y1 = 300;
  var x2 = a.position.x;
  var y2 = a.position.y;

  var deltaX = x2 - x1;
  var deltaY = y2 - y1;

  var degrees = Math.atan2(deltaY, deltaX) * 180 / Math.PI + 90;

  var rotation = Phaser.Math.degToRad(degrees);

  that.sprite.body.rotation = rotation;
  that.instance.update();
};

Penult.Soi.Ship.prototype.position = function() {
  var point = new Phaser.Point(0,0);
  //var anchor = this.planet;

  return point;
};

Penult.Soi.Ship.prototype.positions = function (timeSpan, timeInterval) {
  var iterations = Math.floor(timeSpan / timeInterval);
  var positions = [];

  for (var i = 0; i < iterations; i++) {
    positions[i] = this.position(timeInterval * i);
  }

  return positions;
};

Penult.Soi.Ship.prototype.update = function () {
  var that = this;

  this.thrusting = false;

  if (this.instance.cursors.left.isDown || this.instance.leftKey.isDown)
  {
    this.sprite.body.rotateLeft(this.rotationSpeed * 10);
  }
  else if (this.instance.cursors.right.isDown || this.instance.rightKey.isDown)
  {
    this.sprite.body.rotateRight(this.rotationSpeed * 10);
  }
  else
  {
    this.sprite.body.setZeroRotation();
  }

  if (this.instance.cursors.up.isDown || this.instance.upKey.isDown || this.game.input.pointer1.isDown || this.game.input.mousePointer.isDown)
  {
    this.sprite.body.thrust(this.rotationSpeed * 8);
    this.sprite.animations.play('forward');
    this.thrusting = true;
  }
  else if (this.instance.cursors.down.isDown || this.instance.downKey.isDown)
  {
    this.sprite.body.reverse(this.rotationSpeed * 2);
    this.thrusting = true;
    this.sprite.animations.play('reverse');
  }

  if (!this.thrusting) {
    this.sprite.animations.play('unpowered');
  }

  soi.state.thrusting = this.thrusting;

  that.center = this.instance.Utilities.getCenterPoint(that.sprite);


  _.forEach(that.instance.heavenlyBodies, function(body) {
    var sCenter;

    if (that.inSoi) {
      // sCenter = that.instance.Utilities.getCenterPoint(that.sprite);
      var pCenter = that.instance.Utilities.getCenterPoint(body.gravityWell.sprite);

      var cc  = that.game.add.sprite(that.sprite.position.x, that.sprite.position.y, 'ship');

      cc.scale.setTo(0.05, 0.05);

      if (that.game.camera.target) {
        that.game.camera.follow(null);
        that.game.add.tween(that.game.camera).to( {x: pCenter.x - (that.game.camera.width / 2), y: pCenter.y - (that.game.camera.height / 2) }, 1250, Phaser.Easing.Quadratic.InOut, true);
      }

      var force = that.instance.Utilities.calculateForce(that, body);
      that.sprite.body.applyForce([force.x, force.y * -1], that.center.x, that.center.y);
      that.sprite.body.angularForce = 0;
    } else {
      if (!that.__tweeningCameraToShip && !that.game.camera.target) {
        that.__tweeningCameraToShip = true;
        sCenter = that.instance.Utilities.getCenterPoint(that.sprite);
        var tween = that.game.add.tween(that.game.camera).to( {x: sCenter.x - (that.game.camera.width / 2) + (that.game.physics.p2.mpxi(that.sprite.body.velocity.x) * 0.75), y: sCenter.y - (that.game.camera.height / 2) + (that.game.physics.p2.mpxi(that.sprite.body.velocity.y) * 0.75) }, 750, Phaser.Easing.Sinusoidal.In, true);

        // tween.onUpdateCallback(function(a,b,c,d) {
        //   a._valuesEnd.x = that.sprite.position.x - (that.game.camera.width / 2);
        //   a._valuesEnd.y = that.sprite.position.y - (that.game.camera.width / 2);
        // });

        tween._lastChild.onComplete.add(function() {
          that.game.camera.follow(that.sprite);
          that.__tweeningCameraToShip = false;
        }, that);
      }

      if (!that.instance.state.thrusting) {
        if (Math.abs(that.sprite.body.velocity.x) < 0.1) {
          that.sprite.body.velocity.x = 0;
        }
        if (Math.abs(that.sprite.body.velocity.y) < 0.1) {
          that.sprite.body.velocity.y = 0;
        }
      }
    }
  });
  
 
    /* Overlap Detection */
    _.forEach(that.instance.asteroids, function(asteroid) {
    	if(that.instance.Utilities.checkCollision(that, asteroid)){
    		console.log('hit!');
    	}
    });
  
};