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
  this.targetSystem = new Soi.Entities.CelestialBody(this.game, 4000, 4000);

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

  this.goingToGroup = this.game.add.group();
  this.goingToGroup.create(-1,-1,'goingTo');
  this.goingToGroup.create(-1,-1,'goingTo');
  this.goingToGroup.create(-1,-1,'goingTo');
  this.goingToGroup.create(-1,-1,'goingTo');
  this.goingToGroup.create(-1,-1,'goingTo');
  this.goingToGroup.callAll('anchor.setTo', null, 0.5, 0.5);

  this.goingToIndicator = this.game.add.sprite(0,0,'goingToIndicator');
  this.goingToIndicatorBaseWidth = this.goingToIndicator.width;
  this.goingToIndicator.fixedToCamera = true;
  this.goingToIndicator.visible = false;

  this.lineE = new Phaser.Line(0,0,0,0);

  this.game.time.advancedTiming = true;

  this.fpsText = this.game.add.text(
      10, 510, '', { font: '16px Arial', fill: '#ffffff' }
  );
  this.fpsText.fixedToCamera = true;

  this.shadowTexture = this.game.add.bitmapData(this.game.width, this.game.height);
  var lightSprite = this.game.add.image(0, 0, this.shadowTexture);
  lightSprite.fixedToCamera = true;
  lightSprite.blendMode = Phaser.blendModes.SCREEN;
};

Soi.GameStates.GameplayGameState.prototype.CalculateTargetIndicators = function () {
  var target = this.player;

  if (!target.soi) {
    var tCenter = this.targetSystem.center;
    var tRadius = this.targetSystem.well.radius;
    var sCenter = this.system.center;
    var sRadius = this.system.well.radius;
    var pCenter = { 'x': target.x, 'y': target.y };
    var sTopAngle = Phaser.Math.normalizeAngle(Phaser.Math.angleBetweenPoints(sCenter, pCenter) - Math.PI);
    var sBottomAngle = sTopAngle + Math.PI;
    var tTopAngle = Phaser.Math.normalizeAngle(Phaser.Math.angleBetweenPoints(tCenter, pCenter) - Math.PI);
    var tBottomAngle = tTopAngle + Math.PI;

    var sTop = new Phaser.Point(sCenter.x + (Math.cos(sTopAngle) * sRadius), sCenter.y + (Math.sin(sTopAngle) * sRadius * -1));
    var sBottom = new Phaser.Point(sCenter.x + (Math.cos(sBottomAngle) * sRadius), sCenter.y + (Math.sin(sBottomAngle) * sRadius * -1));

    var tTop = new Phaser.Point(tCenter.x + (Math.cos(tTopAngle) * tRadius), tCenter.y + (Math.sin(tTopAngle) * tRadius * -1));
    var tBottom = new Phaser.Point(tCenter.x + (Math.cos(tBottomAngle) * tRadius), tCenter.y + (Math.sin(tBottomAngle) * tRadius * -1));

    var sTopPlayerAngle = Phaser.Math.normalizeAngle(Soi.Math.angleBetweenPoints(pCenter, sTop));
    var sBottomPlayerAngle = Phaser.Math.normalizeAngle(Soi.Math.angleBetweenPoints(pCenter, sBottom));

    var tTopPlayerAngle = Phaser.Math.normalizeAngle(Soi.Math.angleBetweenPoints(pCenter, tTop));
    var tBottomPlayerAngle = Phaser.Math.normalizeAngle(Soi.Math.angleBetweenPoints(pCenter, tBottom));

    this.sTriTop = this.getEdgePointOfAngle(sTopPlayerAngle);
    this.sTriBottom = this.getEdgePointOfAngle(sBottomPlayerAngle);

    this.tTriTop = this.getEdgePointOfAngle(tTopPlayerAngle);
    this.tTriBottom = this.getEdgePointOfAngle(tBottomPlayerAngle);
  }

  return [
    {
      'name': 'start',
      'sprite': this.system.well,
      'top': this.sTriTop,
      'bottom': this.sTriBottom
    },
    {
      'name': 'end',
      'sprite': this.targetSystem.well,
      'top': this.tTriTop,
      'bottom': this.tTriBottom
    }
  ];
};

Soi.GameStates.GameplayGameState.prototype.getEdgePointOfAngle = function (theta) {
  // Parts of the Triangle
  var pT = {
    'A': 0,
    'B': 0,
    'C': 0,
    'opp': 0,
    'hyp': 0,
    'adj': 0
  };

  pT.A = theta;
  pT.B = Math.PI / 2;
  pT.C = (Math.PI / 2) - theta;

  var point = new Phaser.Point(this.game.camera.x, this.game.camera.y);
  var returnValue = {
    'direction': 'N',
    'point': point
  };
  var a = 0;
  var target = this.player;

  // var point = new Phaser.Point(this.game.camera.x, this.game.camera.y);
  // var a = 0;
  var playerPosition = new Phaser.Point(target.x - this.game.camera.x, target.y - this.game.camera.y);

  var corners = {
    'tr': Math.atan(playerPosition.y / (this.game.camera.width - playerPosition.x)),
    'tl': Math.atan(playerPosition.x / playerPosition.y) + Math.PI / 2,
    'bl': Math.atan((this.game.camera.height - playerPosition.y) / playerPosition.x) + Math.PI,
    'br': Math.atan((this.game.camera.width - playerPosition.x) / (this.game.camera.height - playerPosition.y)) + Math.PI * 3 / 2
  };


  if ((theta >= corners.tr) && (theta < corners.tl)) {
    returnValue.direction = 'N';
    pT.adj = target.y - this.game.camera.y;
    a = (Math.tan(Math.PI / 2 - theta) * pT.adj);
    returnValue.point.x = target.x + a;
  } else if ((theta >= corners.tl) && (theta < corners.bl)) {
    returnValue.direction = 'W';
    pT.adj = target.x - this.game.camera.x;
    a = (Math.tan(Math.PI - theta) * -1 * pT.adj);
    returnValue.point.y = target.y + a;
  } else if ((theta >= corners.bl) && (theta < corners.br)) {
    returnValue.direction = 'S';
    pT.adj = this.game.stage.bounds.height - (target.y - this.game.camera.y);
    a = (Math.tan(Math.PI * 3 / 2 - theta) * -1 * pT.adj);
    returnValue.point.x = target.x + a;
    returnValue.point.y = point.y + this.game.camera.height;
  } else {
    returnValue.direction = 'E';
    pT.adj = this.game.stage.bounds.width - (target.x - this.game.camera.x);
    a = (Math.tan(theta) * -1 * pT.adj);
    returnValue.point.x = point.x + this.game.camera.width;
    returnValue.point.y = target.y + a;
  }

  returnValue.x = returnValue.point.x;
  returnValue.y = returnValue.point.y;

  return returnValue;
};

Soi.GameStates.GameplayGameState.prototype.drawTargetIndicators = function (targets) {
  this.shadowTexture.context.fillStyle = 'rgb(0, 0, 0)';
  this.shadowTexture.context.fillRect(0, 0, this.game.width, this.game.height);
  this.shadowTexture.context.beginPath();

  _.each(targets, function (target) {
    if (!target.sprite.inCamera) {
      // Draw circle of light
      var iT = 3;
      this.shadowTexture.context.fillStyle = 'rgba(0, 48, 96, .75)';

      var tX = target.top.x - this.camera.x;
      var tY = target.top.y - this.camera.y;
      var bX = target.bottom.x - this.camera.x;
      var bY = target.bottom.y - this.camera.y;

      var rX = 0;
      var rY = 0;
      var rW = 0;
      var rH = 0;

      var dT = target.top.direction;
      var dB = target.bottom.direction;

      var cW = this.camera.width;
      var cH = this.camera.height;

      if (dT === dB) {
        switch (dT) {
          case 'N':
            rX = Math.min(tX, bX);
            rY = 0;
            rW = Math.max(Math.abs(tX - bX), iT);
            rH = iT;
            break;
          case 'W':
            rX = 0;
            rY = Math.min(tY, bY);
            rW = iT;
            rH = Math.max(Math.abs(tY - bY), iT);
            break;
          case 'S':
            rX = Math.min(tX, bX);
            rY = cH - iT;
            rW = Math.max(Math.abs(tX - bX), iT);
            rH = iT;
            break;
          case 'E':
            rX = cW - iT;
            rY = Math.min(tY, bY);
            rW = iT;
            rH = Math.max(Math.abs(tY - bY), iT);
            break;
        }

        this.shadowTexture.context.fillRect(rX, rY, rW, rH);
      } else {
        switch (dT) {
          case 'N':
            rX = ((dB === 'W') ? 0 : tX);
            rY = 0;
            rW = cW - tX;
            rH = iT;
            break;
          case 'W':
            rX = 0;
            rY = ((dB === 'N') ? 0 : cH - tY);
            rW = iT;
            rH = tY;
            break;
          case 'S':
            rX = ((dB === 'W') ? 0 : cW - tX);
            rY = cH - iT;
            rW = tX;
            rH = iT;
            break;
          case 'E':
            rX = cW - iT;
            rY = ((dB === 'N') ? 0 : tY);
            rW = iT;
            rH = cH - tY;
            break;
        }

        this.shadowTexture.context.fillRect(rX, rY, rW, rH);

        switch (dB) {
          case 'N':
            rX = ((dT === 'W') ? 0 : cW - bX);
            rY = 0;
            rW = bX;
            rH = iT;
            break;
          case 'W':
            rX = 0;
            rY = ((dT === 'N') ? 0 : bY);
            rW = iT;
            rH = cH - bY;
            break;
          case 'S':
            rX = ((dT === 'W') ? 0 : bX);
            rY = cH - iT;
            rW = cW - bX;
            rH = iT;
            break;
          case 'E':
            rX = cW - iT;
            rY = ((dT === 'N') ? 0 : cH - bY);
            rW = iT;
            rH = bY;
            break;
        }

        this.shadowTexture.context.fillRect(rX, rY, rW, rH);
      }
    }
  }, this);

  this.shadowTexture.context.fill();
  this.shadowTexture.dirty = true;
};

Soi.GameStates.GameplayGameState.prototype.update = function() {
  if (this.game.time.fps !== 0) {
    this.fpsText.setText(this.game.time.fps + ' FPS');
  }

  var targets = this.CalculateTargetIndicators();
  this.drawTargetIndicators(targets);

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
  // this.game.debug.text(Math.cos(this.player.rotation + Math.PI).toFixed(2), 10, 542);
  // this.game.debug.text(Math.sin(this.player.rotation + Math.PI).toFixed(2), 10, 562);
  //this.game.debug.text('', 32, 48);

  // this.game.debug.geom(this.lineE, 'rgba(255,0,0,1)');
  // this.game.debug.geom(this.lineE, 'rgba(255,0,0,1)');
  // this.game.debug.geom(new Phaser.Line(this.player.center.x, this.player.center.y, this.player.center.x + 100, this.player.center.y), 'rgba(255,0,0,1)');
  // this.game.debug.geom(this.sTopLine, 'rgba(255,255,0,1)');
  // this.game.debug.geom(this.sBottomLine, 'rgba(255,0,255,1)');
  // this.game.debug.geom(this.tTopLine, 'rgba(255,255,0,1)');
  // this.game.debug.geom(this.tBottomLine, 'rgba(255,0,255,1)');

  // this.game.debug.geom(this.tTriTop, 'rgba(255,0,255,1)');
  // this.game.debug.geom(this.tTriBottom, 'rgba(255,0,255,1)');
  // this.game.debug.geom(new Phaser.Line(this.tTriTop.x - 10, this.tTriTop.y - 10, this.tTriTop.x + 10, this.tTriTop.y + 10), 'rgba(255,0,0,1)');
  // this.game.debug.geom(new Phaser.Line(this.tTriTop.x + 10, this.tTriTop.y - 10, this.tTriTop.x - 10, this.tTriTop.y + 10), 'rgba(255,0,0,1)');
  // this.game.debug.geom(new Phaser.Line(this.tTriBottom.x - 10, this.tTriBottom.y - 10, this.tTriBottom.x + 10, this.tTriBottom.y + 10), 'rgba(255,0,0,1)');
  // this.game.debug.geom(new Phaser.Line(this.tTriBottom.x + 10, this.tTriBottom.y - 10, this.tTriBottom.x - 10, this.tTriBottom.y + 10), 'rgba(255,0,0,1)');

  // var t = this.targetSystem.center;
  // var p = this.player.center;
  // this.game.debug.text(this.tTriTop.x.toFixed(2) + ' ' + this.tTriTop.y.toFixed(2), 10, 542);
  // this.game.debug.text(this.tTriBottom.x.toFixed(2) + ' ' + this.tTriBottom.y.toFixed(2), 10, 562);
};

Soi.GameStates.GameplayGameState.prototype.collidesWithSurface = function() {
  var that = this;

  this.player.kill();
  this.player.destroy();

  window.setTimeout(function() {
    that.game.state.start(Soi.GameStates.GameStateTypes.Menu.name);
  }, 2000);
};
