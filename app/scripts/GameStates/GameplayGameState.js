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

  this.game.camera.follow(this.player);

  this.player.body.setCollisionGroup(this.collisionGroups.players);
  this.system.surface.body.setCollisionGroup(this.collisionGroups.celestialBodySurfaces);
  this.system.well.body.setCollisionGroup(this.collisionGroups.celestialBodyWells);

  this.player.body.collides(this.collisionGroups.celestialBodySurfaces, this.collidesWithSurface, this);
  this.system.surface.body.collides(this.collisionGroups.players);

  this.player.body.collides(this.collisionGroups.celestialBodyWells);
  this.system.well.body.collides(this.collisionGroups.players);

  this.field = new Soi.Entities.AsteroidField(this.game, 'field1', 1200, 1200);

  this.player.bringToTop();
  this.game.time.advancedTiming = true;
};

Soi.GameStates.GameplayGameState.prototype.update = function() {

};

Soi.GameStates.GameplayGameState.prototype.render = function() {
  this.game.debug.text(parseInt(this.pointer.x) + ' ' + parseInt(this.pointer.y) + ' ' + parseInt(this.pointer.degrees), 32, 48);
  this.game.debug.text(parseInt(this.player.x) + ' ' + parseInt(this.player.y), 32, 68);

  var positions = this.player.calculatePositions(16, 4);
  var that = this;

  this.game.debug.text(parseInt(positions[0].x) + ' ' + parseInt(positions[0].y), 32, 88);

  if (this.player.exists) {
    _.each(positions, function(position) {
      that.game.debug.geom(position, 'rgba(255,0,0,1)');
    });

    _.each(this.player.beenThere, function(position, index, list) {
      var alpha = (_.size(list) - index) / _.size(list)
      that.game.debug.geom(position, 'rgba(0,255,0,' + alpha + ')');
    });
  }


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