Penult = {};

Penult.Soi = function (game) {
  this.game = game;
  this.cursors;
  this.level;
  this.ships = [];
  this.heavenlyBodies = [];
  this.asteroidCount = 500;
  this.asteroids = [];
  this.state = {
    thrusting: false
  };

  this.upKey;
  this.downKey;
  this.leftKey;
  this.rightKey;
};

Penult.Soi.prototype = {};

Penult.Soi.prototype.create = function () {
  game.physics.startSystem(Phaser.Physics.P2JS);
  game.physics.p2.applyDamping = false;
  game.physics.p2.applyGravity = false;
  game.physics.p2.setPostBroadphaseCallback(checkOverlap, this);

  this.cursors = this.game.input.keyboard.createCursorKeys();

  this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
  this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
  this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
  this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);

  this.game.input.addPointer();

  game.stage.backgroundColor = '#000000';

  this.level = new Penult.Soi.Level(this.game, this);

  this.level.create();

  //game.scale.setShowAll();
  //game.scale.setScreenSize(false);



  var hb = new Penult.Soi.HeavenlyBody(this.game, this);
  hb.create(new Phaser.Point(1900, 1900), 'planetoid', true);
  hb.gravityWell.sprite.name = 'well';
  this.heavenlyBodies.push(hb);

  var player = new Penult.Soi.Ship(this.game, this);
  player.create(new Phaser.Point(1500, 1500), 'ship');
  player.sprite.name = 'ship';
  this.ships.push(player);
  
  for (var i=0; i<this.asteroidCount; i++) {
	  var as = new Penult.Soi.Asteroid(this.game, this);
	  as.create(new Phaser.Point(game.world.randomX, game.world.randomY), 'asteroid');
	  as.sprite.name = 'asteroid';
	  this.asteroids.push(as);
  }

  game.camera.follow(player.sprite);
};

Penult.Soi.prototype.preload = function () {
  this.game.load.tilemap('map', 'assets/tilemaps/map.json', null, Phaser.Tilemap.TILED_JSON);
  this.game.load.image('stars', 'assets/imgs/playspace.png');
  this.game.load.image('planetoid', 'assets/imgs/planetoid.png');
  this.game.load.image('asteroid', 'assets/imgs/asteroid.png');
  this.game.load.image('gravityWell', 'assets/imgs/aura.png');
  this.game.load.spritesheet('ship', 'assets/imgs/ship-sprite.png', 75, 85, 13);
};

Penult.Soi.prototype.render = function () {
};

Penult.Soi.prototype.update = function () {
		  
  _.forEach(this.heavenlyBodies, function(body) {
    body.update();
  });

  _.forEach(this.ships, function(ship) {
    ship.update();
  });
  
  _.forEach(this.asteroids, function(asteroid) {
	 asteroid.update();
  });
  
  
};

Penult.Soi.prototype.moveCamera = function (start, end, timespan, steps) {
  var Rigging = function () {
    this.timespan = timespan;
    this.steps = steps;
    this.delta;
  };


  return [];
};