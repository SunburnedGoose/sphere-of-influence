/*global soi:false */
/*jshint -W079 */
'use strict';

var Penult = {};

Penult.Soi = function (game) {
  this.game = game;
  this.cursors = undefined;
  this.level = undefined;
  this.ships = [];
  this.heavenlyBodies = [];
  this.state = {
    thrusting: false
  };

  this.Utilities = {
    'getCenterPoint': function (sprite) {
      var x = sprite.x + ((!sprite.body) ? sprite.width / 2 : 0);
      var y = sprite.y + ((!sprite.body) ? sprite.height / 2 : 0);
      return new Phaser.Point(x,y);
    },
    'isShipInWell': function (b1, b2) {
      var ship = (b1.sprite.name === 'ship') ? b1 : b2;
      var well = (b2.sprite.name === 'well') ? b2 : b1;

      var distanceFromSurface = game.physics.arcade.distanceBetween(soi.Utilities.getCenterPoint(ship.sprite), soi.Utilities.getCenterPoint(well.sprite));

      soi.ships[0].inSoi = distanceFromSurface <= (well.sprite.width / 2);
    },
    'checkOverlap': function (b1, b2) {
      var name = (b1.sprite && b2.sprite) ? b1.sprite.name + '|' + b2.sprite.name : '';

      switch (name) {
        case 'ship|well':
        case 'well|ship':
          soi.Utilities.isShipInWell(b1, b2);
          return false;
        case 'body|well':
        case 'well|body':
          return false;
        default:
          return true;
      }
    }
  };

  this.upKey = undefined;
  this.downKey = undefined;
  this.leftKey = undefined;
  this.rightKey = undefined;
};

Penult.Soi.prototype = {};

Penult.Soi.prototype.create = function () {
  this.game.physics.startSystem(Phaser.Physics.P2JS);
  this.game.physics.p2.applyDamping = false;
  this.game.physics.p2.applyGravity = false;
  this.game.physics.p2.setPostBroadphaseCallback(this.instance.Utilities.checkOverlap, this);

  this.cursors = this.game.input.keyboard.createCursorKeys();

  this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
  this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
  this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
  this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);

  this.game.input.addPointer();

  this.game.stage.backgroundColor = '#000000';

  this.level = new Penult.Soi.Level(this.game, this);

  this.level.create();

  this.game.scale.setShowAll();
  this.game.scale.setScreenSize(false);



  var hb = new Penult.Soi.HeavenlyBody(this.game, this);
  hb.create(new Phaser.Point(1900, 1900), 'planetoid', true);
  hb.gravityWell.sprite.name = 'well';
  hb.sprite.name = 'body';
  this.heavenlyBodies.push(hb);

  var player = new Penult.Soi.Ship(this.game, this);
  player.create(new Phaser.Point(1500, 1500), 'ship');
  player.sprite.name = 'ship';
  this.ships.push(player);

  this.game.camera.follow(player.sprite);
};

Penult.Soi.prototype.preload = function () {
  this.game.load.tilemap('map', 'assets/tilemaps/map.json', null, Phaser.Tilemap.TILED_JSON);
  this.game.load.image('stars', 'assets/imgs/playspace.png');
  this.game.load.image('planetoid', 'assets/imgs/planetoid.png');
  this.game.load.image('gravityWell', 'assets/imgs/aura.png');
  this.game.load.image('neptune', 'assets/imgs/neptune.png');
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
};