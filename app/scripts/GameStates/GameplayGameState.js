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

  this.hud = new Soi.Entities.HUD(this.game);
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

  this.sTopLine = new Phaser.Line(this.player.center.x, this.player.center.y, this.system.center.x, this.system.center.y);
  this.sBottomLine = new Phaser.Line(this.player.center.x, this.player.center.y, this.system.center.x, this.system.center.y);

  this.tTopLine = new Phaser.Line(this.player.center.x, this.player.center.y, this.targetSystem.center.x, this.targetSystem.center.y);
  this.tBottomLine = new Phaser.Line(this.player.center.x, this.player.center.y, this.targetSystem.center.x, this.targetSystem.center.y);

  this.goingToGroup = this.game.add.group();
  this.goingToGroup.create(-1,-1,'goingTo');
  this.goingToGroup.create(-1,-1,'goingTo');
  this.goingToGroup.create(-1,-1,'goingTo');
  this.goingToGroup.create(-1,-1,'goingTo');
  this.goingToGroup.create(-1,-1,'goingTo');
  this.goingToGroup.callAll('anchor.setTo', null, 0.5, 0.5);

  this.lineE = new Phaser.Line(0,0,0,0);

  this.game.time.advancedTiming = true;
  this.fpsText = this.game.add.text(
      10, 510, '', { font: '16px Arial', fill: '#ffffff' }
  );
  this.fpsText.fixedToCamera = true;
};

Soi.GameStates.GameplayGameState.prototype.update = function() {
  if (this.game.time.fps !== 0) {
    this.fpsText.setText(this.game.time.fps + ' FPS');
  }

  var tCenter = this.targetSystem.center;
  var tRadius = this.targetSystem.well.radius;
  var pCenter = this.player.center;
  var sCenter = this.system.center;
  var sRadius = this.system.well.radius;
  var sTopAngle = Phaser.Math.normalizeAngle(Phaser.Math.angleBetweenPoints(sCenter, pCenter) - Math.PI);
  var sBottomAngle = sTopAngle + Math.PI;
  var tTopAngle = Phaser.Math.normalizeAngle(Phaser.Math.angleBetweenPoints(tCenter, pCenter) - Math.PI);
  var tBottomAngle = tTopAngle + Math.PI;

  this.sTopLine.start.set(pCenter.x, pCenter.y);
  this.sTopLine.end.set(sCenter.x + (Math.cos(sTopAngle) * sRadius), sCenter.y + (Math.sin(sTopAngle) * sRadius * -1));

  this.sBottomLine.start.set(pCenter.x, pCenter.y);
  this.sBottomLine.end.set(sCenter.x + (Math.cos(sBottomAngle) * sRadius), sCenter.y + (Math.sin(sBottomAngle) * sRadius * -1));

  var tTop = new Phaser.Point(tCenter.x + (Math.cos(tTopAngle) * tRadius), tCenter.y + (Math.sin(tTopAngle) * tRadius * -1));
  var tBottom = new Phaser.Point(tCenter.x + (Math.cos(tBottomAngle) * tRadius), tCenter.y + (Math.sin(tBottomAngle) * tRadius * -1));

  this.tTopLine.start.set(pCenter.x, pCenter.y);
  this.tTopLine.end.set(tTop.x, tTop.y);

  this.tBottomLine.start.set(pCenter.x, pCenter.y);
  this.tBottomLine.end.set(tBottom.x, tBottom.y);

  var that = this;

  if (this.player.exists) {
    _.each(this.player.futurePosition, function(position, index) {
      var c = that.goingToGroup.getAt(index);
      c.x = position.x;
      c.y = position.y;
    });
  }

 // var playerBounds = this.player.getBounds();



  // var angleE = Phaser.Math.normalizeAngle(Phaser.Math.angleBetweenPoints({ 'x': tCenter.x, 'y': tCenter.y - this.targetSystem.well.radius }, pCenter));
  // var angleF = Phaser.Math.normalizeAngle(Phaser.Math.angleBetweenPoints({ 'x': tCenter.x, 'y': tCenter.y + this.targetSystem.well.radius }, pCenter));

  // var shortLength = Math.sin(angleE) * (this.stage.bounds.width - playerBounds.x);
  // var longLength = Math.sin(angleF) * (this.stage.bounds.width - playerBounds.x);

  // this.lineE.start.set(pCenter.x, pCenter.y);
  // this.lineE.end.set(pCenter.x + 100, Math.abs(longLength));
};

Soi.GameStates.GameplayGameState.prototype.render = function() {
  //this.game.debug.text('', 32, 48);

  // this.game.debug.geom(this.lineE, 'rgba(255,0,0,1)');
  // this.game.debug.geom(this.lineE, 'rgba(255,0,0,1)');
  this.game.debug.geom(new Phaser.Line(this.player.center.x, this.player.center.y, this.player.center.x + 100, this.player.center.y), 'rgba(255,0,0,1)');
  this.game.debug.geom(this.sTopLine, 'rgba(255,255,0,1)');
  this.game.debug.geom(this.sBottomLine, 'rgba(255,0,255,1)');
  this.game.debug.geom(this.tTopLine, 'rgba(255,255,0,1)');
  this.game.debug.geom(this.tBottomLine, 'rgba(255,0,255,1)');
  var t = this.targetSystem.center;
  var p = this.player.center;
  this.game.debug.text(Phaser.Math.angleBetweenPoints(t,p).toFixed(2), 10, 542);
  this.game.debug.text(Phaser.Math.angleBetweenPoints(p, t).toFixed(2), 10, 562);
};

Soi.GameStates.GameplayGameState.prototype.collidesWithSurface = function() {
  var that = this;

  this.player.kill();
  this.player.destroy();

  window.setTimeout(function() {
    that.game.state.start(Soi.GameStates.GameStateTypes.Menu.name);
  }, 2000);
};
