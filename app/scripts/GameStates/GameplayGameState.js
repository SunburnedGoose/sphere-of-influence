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

  this.game.camera.follow(this.player);

  this.player.body.setCollisionGroup(this.collisionGroups.players);
  this.system.surface.body.setCollisionGroup(this.collisionGroups.celestialBodySurfaces);
  this.system.well.body.setCollisionGroup(this.collisionGroups.celestialBodyWells);
  this.targetSystem.surface.body.setCollisionGroup(this.collisionGroups.celestialBodySurfaces);
  this.targetSystem.well.body.setCollisionGroup(this.collisionGroups.celestialBodyWells);

  this.player.body.collides(this.collisionGroups.celestialBodySurfaces, this.collidesWithSurface, this);
  this.system.surface.body.collides(this.collisionGroups.players);
  this.targetSystem.surface.body.collides(this.collisionGroups.players);

  this.player.body.collides(this.collisionGroups.celestialBodyWells);
  this.system.well.body.collides(this.collisionGroups.players);
  this.targetSystem.well.body.collides(this.collisionGroups.players);

  this.field = new Soi.Entities.AsteroidField(this.game, 'field1', 1200, 1200);

  this.player.bringToTop();
  this.game.time.advancedTiming = true;
};

Soi.GameStates.GameplayGameState.prototype.update = function() {

};

Soi.GameStates.GameplayGameState.prototype.render = function() {
  //this.game.debug.text(this.game.input.activePointer.button, 32, 48);
  //this.game.debug.text(this.player.body.rotation.toFixed(2) + ' ' + Phaser.Math.normalizeAngle(this.player.body.rotation).toFixed(2) + ' ' + (!_.isNull(this.player.state.rotatingTo) ? this.player.state.rotatingTo.toFixed(2) : null) , 32, 48);
  // this.game.debug.text(parseInt(this.pointer.x) + ' ' + parseInt(this.pointer.y) + ' ' + parseInt(this.pointer.degrees), 32, 48);
  this.game.debug.text(parseInt(this.player.x) + ' ' + parseInt(this.player.y), 32, 68);
  var angleA = Phaser.Math.normalizeAngle(Phaser.Math.angleBetweenPoints(this.player.center, this.targetSystem.center) - Math.PI / 2);
  var pointA = new Phaser.Point(this.targetSystem.center.x + ((this.targetSystem.well.width / 2) * Math.cos(angleA)), this.targetSystem.center.x + ((this.targetSystem.well.width / 2) * Math.sin(angleA)));
  var angleB = Phaser.Math.normalizeAngle(angleA + Math.PI);
  var pointB = new Phaser.Point(this.targetSystem.center.x + ((this.targetSystem.well.width / 2) * Math.cos(angleB)), this.targetSystem.center.x + ((this.targetSystem.well.width / 2) * Math.sin(angleB)));

  this.game.debug.text(angleA.toFixed(2) + ' - ' + parseInt(pointA.x, 10) + ' ' + parseInt(pointA.y, 10) + ', ' + angleB.toFixed(2) + ' - ' + parseInt(pointB.x, 10) + ' ' + parseInt(pointB.y, 10), 32, 48);

  var positions = this.player.calculatePositions(12, 4);
  var that = this;

  // this.game.debug.text(parseInt(positions[0].x) + ' ' + parseInt(positions[0].y), 32, 88);

  if (this.player.exists) {
    _.each(positions, function(position) {
      that.game.debug.geom(position, 'rgba(255,0,0,1)');
    });

    // _.each(this.player.beenThere, function(position, index, list) {
    //   var alpha = (_.size(list) - index) / _.size(list);
    //   that.game.debug.geom(position, 'rgba(0,255,0,' + alpha + ')');
    // });
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