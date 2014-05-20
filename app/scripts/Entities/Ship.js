'use strict';

namespace('Soi.Entities');

Soi.Entities.Ship = function(game, x, y, texture) {
  var that = this;

  Phaser.Sprite.call(this, game, x, y, texture);

  this.game.world.add(this);
  this.game.physics.p2.enable([this], true);

  this.beenThere = [];

  this.body.clearShapes();
  this.body.addPhaserPolygon('ship-physics', 'ship');

  // this.game.input.onHold.add(function(a) {
  //   that.changeVector(a, that);
  // });

  this.state = {
    'rotatingTo': null,
    'thrusters': {
      'thrusting': false,
      'forward': {
        'thrusting': false,
        'baseVelocity': 80,
        'multiplier': 1.0
      },
      'reverse': {
        'thrusting': false,
        'baseVelocity': 20,
        'multiplier': 1.0
      },
      'left': {
        'thrusting': false,
        'baseVelocity': 50,
        'multiplier': 1.0
      },
      'right': {
        'thrusting': false,
        'baseVelocity': 50,
        'multiplier': 1.0
      }
    }
  };

  var textureMeta = this.game.__meta.spritesheet[texture];

  _.each(textureMeta.animations, function(animation) {
    that.animations.add(animation.name, animation.frames, animation.number, animation.loop);
  });

  this.animations.play(textureMeta.initial);

  this.game.time.events.loop(Phaser.Timer.SECOND * 0.5, this.captureBeenThere, this);
};

Soi.Entities.Ship.prototype = Object.create(Phaser.Sprite.prototype);
Soi.Entities.Ship.prototype.constructor = Soi.Entities.Ship;

Soi.Entities.Ship.prototype.update = function() {
  var state = this.state;
  var gameState = this.game.state.states[this.game.state.current];
  var cursors = gameState.cursors;
  var keys = gameState.keys;
  var prevState = _.cloneDeep(state);
  var pT = prevState.thrusters;
  var sT = state.thrusters;

  /* Thrusting */
  sT.left.thrusting = (cursors.left.isDown || keys.left.isDown);
  sT.right.thrusting = (cursors.right.isDown || keys.right.isDown);

  if (this.game.input.activePointer.isDown) {
    var pX = this.game.input.activePointer.worldX;
    var pY = this.game.input.activePointer.worldY;
    var sX = this.x;
    var sY = this.y;

    var deltaX = pX - sX;
    var deltaY = pY - sY;

    var degrees = Math.atan2(deltaY, deltaX) * 180 / Math.PI + 90;

    state.rotatingTo = Phaser.Math.normalizeAngle(Phaser.Math.degToRad(degrees));
    var normalizedAngle = Phaser.Math.normalizeAngle(this.body.rotation);
    var positive = (normalizedAngle > state.rotatingTo);

    if (Math.abs(normalizedAngle - state.rotatingTo) > (Math.PI)) {
      if (positive) {
        sT.right.thrusting = true;
      } else {
        sT.left.thrusting = true;
      }
    } else {
      if (positive) {
        sT.left.thrusting = true;
      } else {
        sT.right.thrusting = true;
      }
    }

    var upperBound = normalizedAngle + 0.05;
    var lowerBound = normalizedAngle - 0.05;

    if ((state.rotatingTo >= lowerBound) && (state.rotatingTo <= upperBound)) {
      this.body.rotation = state.rotatingTo;
      state.rotatingTo = null;
      sT.right.thrusting = false;
      sT.left.thrusting = false;
    }
  } else {
    state.rotatingTo = null;
  }

  sT.forward.thrusting = (cursors.up.isDown || keys.up.isDown ||
    (this.game.input.activePointer.isDown && ((this.game.input.activePointer.button === 0) || _.isEmpty(this.game.input.activePointer.button)))) &&
      (_.isNull(state.rotatingTo));
  sT.reverse.thrusting = (cursors.down.isDown || keys.down.isDown ||
    (this.game.input.activePointer.isDown && this.game.input.activePointer.button === 2)) && (_.isNull(state.rotatingTo));

  sT.thrusting = (sT.left.thrusting || sT.right.thrusting || sT.forward.thrusting || sT.reverse.thrusting);

  /* Apply rotational thrusting seperately from forward and reverse. */
  if (sT.left.thrusting && sT.right.thrusting) {
    this.body.setZeroRotation();
  } else if (sT.right.thrusting) {
    this.body.rotateRight(sT.right.baseVelocity * 2.0 * sT.right.multiplier);
  } else if (sT.left.thrusting) {
    this.body.rotateLeft(sT.left.baseVelocity * 2.0 * sT.left.multiplier);
  } else {
    this.body.setZeroRotation();
  }

  if (sT.forward.thrusting) {
    this.body.thrust(sT.forward.baseVelocity * sT.forward.multiplier);
  } else if (sT.reverse.thrusting) {
    this.body.reverse(sT.reverse.baseVelocity * sT.reverse.multiplier);
  }

  /* Animations
     Check and see if I was thrusting in the previous update.
     If so, apply counter thrust via animation to stop rotation. */
  if (!sT.thrusting) {
    /* One or the other, but not both. */
    if ((pT.left.thrusting || pT.right.thrusting) && !(pT.left.thrusting && pT.right.thrusting)) {
      this.animations.play((pT.left.thrusting) ? 'right' : 'left');
    } else {
      this.animations.play('unpowered');
    }
  } else {
    /* Stock animations. */
    if (sT.forward.thrusting) {
      this.animations.play('forward');
    } else if (sT.reverse.thrusting) {
      this.animations.play('reverse');
    } else if (sT.left.thrusting) {
      this.animations.play('left');
    } else if (sT.right.thrusting) {
      this.animations.play('right');
    } else {
      this.animations.play('unpowered');
    }
  }

  if (this.soi) {
    var centerW = this.soi.well.center;

    if (this.game.camera.target) {
      this.game.camera.follow(null);
      this.game.add.tween(this.game.camera).to( {x: centerW.x - (this.game.camera.width / 2), y: centerW.y - (this.game.camera.height / 2) }, 1250, Phaser.Easing.Quadratic.InOut, true);
    }

    var forceVector = this.calculateForce();

    this.body.applyForce([forceVector.x, forceVector.y * -1], this.center.x, this.center.y);
    this.body.angularForce = 0;
  } else {
    if (!this.__tweeningCameraToShip && !this.game.camera.target) {
      this.__tweeningCameraToShip = true;

      var sCenter = this.center;
      var tween = this.game.add.tween(this.game.camera).to({
        'x': sCenter.x - (this.game.camera.width / 2) + (this.game.physics.p2.mpxi(this.body.velocity.x) * 0.75),
        'y': sCenter.y - (this.game.camera.height / 2) + (this.game.physics.p2.mpxi(this.body.velocity.y) * 0.75)
      }, 750, Phaser.Easing.Sinusoidal.In, true);

      tween._lastChild.onComplete.add(function() {
        this.game.camera.follow(this);
        this.__tweeningCameraToShip = false;
      }, this);
    }

    if (!sT.thrusting) {
      if (Math.abs(this.body.velocity.x) < 0.1) {
        this.body.velocity.x = 0;
      }
      if (Math.abs(this.body.velocity.y) < 0.1) {
        this.body.velocity.y = 0;
      }
    }
  }

  /* Overlap Detection */
  if (this.withinAsteroid) {
    this.damage();
    // Penult.Soi.Ship.prototype.damage(that);
    // Penult.Soi.Shield.prototype.update(that, -.5, false);
  }
};

Soi.Entities.Ship.prototype.captureBeenThere = function() {
  this.beenThere.unshift(this.center);

  if (_.size(this.beenThere) > 30) {
    this.beenThere.pop();
  }
};

Soi.Entities.Ship.prototype.damage = function(){
  this.alpha = 1;

  for (var i = 0; i < 6; i++)  {
    //TODO: Not particularlly happy with this blinking animation
    this.game.add.tween(this).to(
      {
        'alpha': 0
      }, 250, Phaser.Easing.Linear.None, true, 0, 4, false).to(
      {
        'alpha': 1
      }, 100, Phaser.Easing.Linear.None, true);
  }

  this.alpha = 1;
};

Object.defineProperty(Soi.Entities.Ship.prototype, 'center', {
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

// SoiIntermediate.Ship.prototype.changeVector = function(a, that) {
//   //ship.body.velocity.x = ship.body.velocity.y = 0;
//   var x1 = 400;
//   var y1 = 300;
//   var x2 = a.position.x;
//   var y2 = a.position.y;

//   var deltaX = x2 - x1;
//   var deltaY = y2 - y1;

//   var degrees = Math.atan2(deltaY, deltaX) * 180 / Math.PI + 90;

//   var rotation = Phaser.Math.degToRad(degrees);

//   that.body.rotation = rotation;
//   that.instance.update();
// };

// SoiIntermediate.Ship.prototype.position = function() {
//   var point = new Phaser.Point(0,0);
//   //var anchor = this.planet;

//   return point;
// };

// SoiIntermediate.Ship.prototype.positions = function (timeSpan, timeInterval) {
//   var iterations = Math.floor(timeSpan / timeInterval);
//   var positions = [];

//   for (var i = 0; i < iterations; i++) {
//     positions[i] = this.position(timeInterval * i);
//   }

//   return positions;
// };


Soi.Entities.Ship.prototype.calculatePosition = function() {

};

Soi.Entities.Ship.prototype.calculatePositions = function() {
  var positions = [];
  var currentPosition = this.center;
  var currentVelocity = new Phaser.Point(this.body.velocity.x, this.body.velocity.y);
  //var intervals = Math.floor(totalTime / timeStep);

  var step = 10;

  for(var i = 0; i < 3000; i = i + step) {

    var currentForce = this.calculateForce(currentPosition);

    var fx = this.body.world.pxmi(currentForce.x * -1 * this.body.world.frameRate * step);
    var fy = this.body.world.pxmi(currentForce.y * 1 * this.body.world.frameRate * step);

    currentVelocity.x += fx;
    currentVelocity.y += fy;

    currentPosition.x += currentVelocity.x * -1 * this.body.world.frameRate * step;
    currentPosition.y += currentVelocity.y * -1 * this.body.world.frameRate * step;

    if (i % 600 > 599 - step) {
      positions.push(new Phaser.Point(currentPosition.x, currentPosition.y));
    }
  }

  return positions;
};

Soi.Entities.Ship.prototype.calculateFuturePositions = function() {

};

Soi.Entities.Ship.prototype.calculateForce = function (pointA, pointB) {
  if (this.soi) {
    if (_.isEmpty(pointA)) {
      pointA = this.center;
    }

    if (_.isEmpty(pointB)) {
      pointB = this.soi.center;
    }

    var d = Phaser.Math.distance(pointA.x, pointA.y, pointB.x, pointB.y);
    var g = this.soi.gravity;
    var mass = this.soi.mass;
    var f = g * mass / Math.max(d * d, 10);
    var a = Phaser.Math.angleBetweenPoints(pointA, pointB) + Math.PI / 2;

    return new Phaser.Point(f * Math.cos(a), f * Math.sin(a));
  } else {
    return new Phaser.Point(0,0);
  }
};