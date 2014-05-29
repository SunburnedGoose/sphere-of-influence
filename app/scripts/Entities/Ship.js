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

  for(var i = 0; i < 60; i++) {
    var currentForce = this.calculateForce(currentPosition);

    var fx = this.body.world.pxmi(currentForce.x * -1 * 0.85);
    var fy = this.body.world.pxmi(currentForce.y * 1 * 0.85);

    currentVelocity.x = currentVelocity.x + fx;
    currentVelocity.y = currentVelocity.y + fy;

    currentPosition.x += currentVelocity.x * -1 * 0.85;
    currentPosition.y += currentVelocity.y * -1 * 0.85;

    if (i % 12 == 11) {
      positions.push(new Phaser.Point(currentPosition.x, currentPosition.y));
    }
  }

  return positions;
};

Soi.Entities.Ship.prototype.calculateFuturePositions = function() {
  var positions = [];

  var s = new State();

  s.aPoint = new Phaser.Point(this.center.x, this.center.y);
  s.bPoint =  new Phaser.Point(this.soi.center.x, this.soi.center.y)
  s.bGravity = this.soi.gravity;
  s.bMass = this.soi.mass;
  s.aVelocity = new Phaser.Point(this.body.velocity.x, this.body.velocity.y);
  s.world = this.body.world;

  var t = 0;
  var dt = 2;

  var a = integrate(s, t, dt);
  var b = integrate(s, t + dt, dt);
  var c = integrate(s, t + (2 * dt), dt);
  var d = integrate(s, t + (3 * dt), dt);
  var e = integrate(s, t + (4 * dt), dt);

  positions.push(a);
  positions.push(b);
  positions.push(c);
  positions.push(d);
  positions.push(e);

  return positions;
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

function State () {
  this.aPoint = new Phaser.Point(0,0);
  this.bPoint = new Phaser.Point(0,0);
  this.aVelocity = new Phaser.Point(0,0);
  this.bGravity = 0;
  this.bMass = 0;
  this.world = null;
}

function Derivative () {
  this.dp = new Phaser.Point(0,0);
  this.dv = new Phaser.Point(0,0);
}

function evaluate(initial, t, dt, d) {
  var state = new State();
  state.aPoint = new Phaser.Point(initial.aPoint.x + d.dp.x * dt, initial.aPoint.y + d.dp.y * dt);
  state.aVelocity = new Phaser.Point(initial.aVelocity.x + d.dv.x * dt, initial.aVelocity.y + d.dv.y * dt);
  state.bPoint = initial.bPoint;
  state.bGravity = initial.bGravity;
  state.bMass = initial.bMass;
  state.world = initial.world;

  var output = new Derivative();
  output.dp = state.aVelocity;
  output.dv = acceleration(state, t + dt);
  return output;
}

function acceleration(state, t) {
  var d = Phaser.Math.distance(state.aPoint.x, state.aPoint.y, state.bPoint.x, state.bPoint.y);
  var g = state.bGravity;
  var mass = state.bMass;
  var f = g * mass / Math.max(d * d, 10);
  var a = Phaser.Math.angleBetweenPoints(state.aPoint, state.bPoint) + Math.PI / 2;

  return new Phaser.Point(state.world.pxmi(f * Math.cos(a)), state.world.pxmi(f * Math.sin(a)));
}

function integrate(state, t, dt) {
  var a,b,c,d;

  a = evaluate(state, t, 0.0, new Derivative());
  b = evaluate(state, t, dt * 0.5, a);
  c = evaluate(state, t, dt * 0.5, b);
  d = evaluate(state, t, dt, c);

  var dxdt = 1.0 / 6.0 * (a.dp.x + (2.0 * (b.dp.x + c.dp.x)) + d.dp.x);
  var dydt = -1.0 / 6.0 * (a.dp.y + (2.0 * (b.dp.y + c.dp.y)) + d.dp.y);

  var dvxdt = 1.0 / 6.0 * (a.dv.x + (2.0 * (b.dv.x + c.dv.x)) + d.dv.x);
  var dvydt = 1.0 / 6.0 * (a.dv.y + (2.0 * (b.dv.y + c.dv.y)) + d.dv.y);

  state.aPoint.x = state.aPoint.x + dxdt * dt;
  state.aPoint.y = state.aPoint.y + dydt * dt;
  state.aVelocity.x = state.aVelocity.x + (dvxdt * dt);
  state.aVelocity.y = state.aVelocity.y + (dvydt * dt);

  return state;
}