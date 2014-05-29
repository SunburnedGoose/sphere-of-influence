'use strict';

namespace('Soi.GameStates');

Soi.GameStates.GameplayGameState = function() {
  Soi.GameStates.GameState.call(this);

  this.ships = {
    'local': null,
    'players': [],
    'enemies': []
  };

  this.objectives = {
    'alpha': null,
    'omega': null,
    'derelicts': [],
    'outposts': [],
    'smallBodies': []
  };

  this.dangers = {
    'comets': [],
    'debrisFields': [],
    'waves': [],
    'asteroids': []
  };

  this.pointer = {
    'x': 0,
    'y': 0
  };
};

Soi.GameStates.GameplayGameState.prototype = Object.create(Soi.GameStates.GameState.prototype);
Soi.GameStates.GameplayGameState.prototype.constructor = Soi.GameStates.GameplayGameState;

Soi.GameStates.GameplayGameState.prototype.create = function() {
  this.game.physics.startSystem(Phaser.Physics.P2JS);

  this.game.physics.p2.applyDamping = false;
  this.game.physics.p2.applyGravity = false;
  this.game.physics.p2.setImpactEvents(true);
  this.game.physics.p2.updateBoundsCollisionGroup();

  this.collisionGroups = {
    'players': this.game.physics.p2.createCollisionGroup(),
    'celestialBodySurfaces': this.game.physics.p2.createCollisionGroup(),
    'celestialBodyWells': this.game.physics.p2.createCollisionGroup(),
    'asteroids': this.game.physics.p2.createCollisionGroup()
  };

  this.cursors = this.game.input.keyboard.createCursorKeys();
  this.keys = {
    'up': this.game.input.keyboard.addKey(Phaser.Keyboard.W),
    'down': this.game.input.keyboard.addKey(Phaser.Keyboard.S),
    'left': this.game.input.keyboard.addKey(Phaser.Keyboard.A),
    'right': this.game.input.keyboard.addKey(Phaser.Keyboard.D)
  };

  this.game.input.addPointer();

  this.map = this.game.add.tilemap('map');
  this.map.addTilesetImage('stars');

  this.map.createLayer('Tile Layer 1');
  var layer2 = this.map.createLayer('Tile Layer 2');

  layer2.resizeWorld();

  this.shield = new Soi.Entities.Shield(this.game);
  this.shield.strength = 100;

  this.player = new Soi.Entities.Ship(this.game, 1400, 1400, 'ship');
  this.system = new Soi.Entities.CelestialBody(this.game, 1700, 1700);
  this.targetSystem = new Soi.Entities.CelestialBody(this.game, 9000, 9000);

  var orbitAngle = Math.random() * Math.PI * 2;

  this.player.body.x = this.system.surface.x + (170 * Math.cos(orbitAngle));
  this.player.body.y = this.system.surface.y + (170 * Math.sin(orbitAngle));

  this.player.body.rotation = orbitAngle;
  this.player.body.velocity.x = 100 * Math.sin(orbitAngle);
  this.player.body.velocity.y = 100 * -1 * Math.cos(orbitAngle);

  this.game.camera.follow(this.system.surface);

  this.player.body.setCollisionGroup(this.collisionGroups.players);
  this.system.surface.body.setCollisionGroup(this.collisionGroups.celestialBodySurfaces);
  this.system.well.body.setCollisionGroup(this.collisionGroups.celestialBodyWells);
  this.targetSystem.surface.body.setCollisionGroup(this.collisionGroups.celestialBodySurfaces);
  this.targetSystem.well.body.setCollisionGroup(this.collisionGroups.celestialBodyWells);

  this.player.body.collides(this.collisionGroups.celestialBodySurfaces, this.collidesWithSurface, this);
  this.player.body.collides(this.collisionGroups.celestialBodyWells);
  this.player.body.collides(this.collisionGroups.asteroids);

  this.system.surface.body.collides(this.collisionGroups.players);
  this.system.well.body.collides(this.collisionGroups.players);

  this.targetSystem.surface.body.collides(this.collisionGroups.players);
  this.targetSystem.well.body.collides(this.collisionGroups.players);

  for (var i = 0; i < Soi.Entities.fields.length; i++) {
    this.field = new Soi.Entities.AsteroidField(this.game, Soi.Entities.fields[i]);
  }

  this.player.bringToTop();
  this.game.time.advancedTiming = true;

  this.lineA = new Phaser.Line(this.player.center.x, this.player.center.y, this.system.center.x, this.system.center.y);
  this.lineB = new Phaser.Line(this.player.center.x, this.player.center.y, this.system.center.x, this.system.center.y);

  this.lineC = new Phaser.Line(this.player.center.x, this.player.center.y, this.targetSystem.center.x, this.targetSystem.center.y);
  this.lineD = new Phaser.Line(this.player.center.x, this.player.center.y, this.targetSystem.center.x, this.targetSystem.center.y);
};

Soi.GameStates.GameplayGameState.prototype.update = function() {
  var angleA = Phaser.Math.normalizeAngle(Phaser.Math.angleBetweenPoints(this.system.center, this.player.center) - Math.PI);
  var angleB = angleA + Math.PI;
  var angleC = Phaser.Math.normalizeAngle(Phaser.Math.angleBetweenPoints(this.targetSystem.center, this.player.center) - Math.PI);
  var angleD = angleC + Math.PI;

  this.lineA.start.set(this.player.center.x, this.player.center.y);
  this.lineA.end.set(this.system.center.x + (Math.cos(angleA) * this.system.well.radius), this.system.center.y + (Math.sin(angleA) * this.system.well.radius * -1));

  this.lineB.start.set(this.player.center.x, this.player.center.y);
  this.lineB.end.set(this.system.center.x + (Math.cos(angleB) * this.system.well.radius), this.system.center.y + (Math.sin(angleB) * this.system.well.radius * -1));

  this.lineC.start.set(this.player.center.x, this.player.center.y);
  this.lineC.end.set(this.targetSystem.center.x + (Math.cos(angleC) * this.targetSystem.well.radius), this.targetSystem.center.y + (Math.sin(angleC) * this.targetSystem.well.radius * -1));

  this.lineD.start.set(this.player.center.x, this.player.center.y);
  this.lineD.end.set(this.targetSystem.center.x + (Math.cos(angleD) * this.targetSystem.well.radius), this.targetSystem.center.y + (Math.sin(angleD) * this.targetSystem.well.radius * -1));
};

Soi.GameStates.GameplayGameState.prototype.render = function() {
  //this.game.debug.text(this.game.input.activePointer.button, 32, 48);
  //this.game.debug.text(this.player.body.rotation.toFixed(2) + ' ' + Phaser.Math.normalizeAngle(this.player.body.rotation).toFixed(2) + ' ' + (!_.isNull(this.player.state.rotatingTo) ? this.player.state.rotatingTo.toFixed(2) : null) , 32, 48);
  // this.game.debug.text(parseInt(this.pointer.x) + ' ' + parseInt(this.pointer.y) + ' ' + parseInt(this.pointer.degrees), 32, 48);
  this.game.debug.text(parseInt(this.player.x) + ' ' + parseInt(this.player.y), 32, 68);
  // var angleA = Phaser.Math.normalizeAngle(Phaser.Math.angleBetweenPoints(this.player.center, this.targetSystem.center) - Math.PI / 2);
  // var pointA = new Phaser.Point(this.targetSystem.center.x + ((this.targetSystem.well.width / 2) * Math.cos(angleA)), this.targetSystem.center.x + ((this.targetSystem.well.width / 2) * Math.sin(angleA)));
  // var angleB = Phaser.Math.normalizeAngle(angleA + Math.PI);
  // var pointB = new Phaser.Point(this.targetSystem.center.x + ((this.targetSystem.well.width / 2) * Math.cos(angleB)), this.targetSystem.center.x + ((this.targetSystem.well.width / 2) * Math.sin(angleB)));

  var shipSystemAngle = Phaser.Math.normalizeAngle(Phaser.Math.angleBetweenPoints( this.system.center, this.player.center) - Math.PI / 2);
  this.game.debug.text(shipSystemAngle.toFixed(2) + ' ' + Math.cos(shipSystemAngle).toFixed(2) + ' ' + (Math.sin(shipSystemAngle).toFixed(2) * -1), 32, 48);

  var positions = this.player.calculatePositions(12, 4);
  // var positions = this.player.calculateFuturePositions();
  var that = this;

  this.game.debug.geom(this.lineA, 'rgba(255,0,0,1)');
  this.game.debug.geom(this.lineB, 'rgba(255,0,0,1)');
  this.game.debug.geom(this.lineC, 'rgba(255,255,0,1)');
  this.game.debug.geom(this.lineD, 'rgba(255,255,0,1)');
  // this.game.debug.geom(this.lineB);

  // this.game.debug.text(parseInt(positions[0].x) + ' ' + parseInt(positions[0].y), 32, 88);

  if (this.player.exists) {
    _.each(positions, function(position) {
      that.game.debug.geom(position, 'rgba(255,0,0,1)');
    });

    _.each(this.player.beenThere, function(position, index, list) {
      var alpha = (_.size(list) - index) / _.size(list);
      that.game.debug.geom(position, 'rgba(0,255,0,' + alpha + ')');
    });
  }

  //if (this.player.a) {
  //this.game.debug.text(parseInt(this.player.a.position.x) + ' ' + parseInt(this.player.a.positionDown.x) + ' ' + parseInt(this.player.a.screenX), 32, 48);
  //}
  // this.game.debug.text(parseInt(this.player.x) + ' ' + parseInt(this.player.y), 32, 48);
  // this.game.debug.text("inGravityWell: " + ((!_.isEmpty(this.player.gravityWell)) ? 'true' : 'false'), 32, 68);
  // this.game.debug.text("withinAsteroid: " + ((!_.isEmpty(this.player.withinAsteroid)) ? 'true' : 'false'), 32, 88);
};

Soi.GameStates.GameplayGameState.prototype.collidesWithSurface = function() {
  var that = this;

  this.player.kill();
  this.player.destroy();

  window.setTimeout(function() {
    that.game.state.start(Soi.GameStates.GameStateTypes.Menu.name);
  }, 2000);
};