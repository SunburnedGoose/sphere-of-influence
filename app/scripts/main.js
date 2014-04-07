var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', {'create': create, 'preload': preload, 'update': update});
var cursors;
var ship;
var tilesprite;
var speed;
var map;
var layer;

function create() {
  speed = 10;

  game.physics.startSystem(Phaser.Physics.P2JS);

  game.stage.backgroundColor = '#000000';
  game.scale.setShowAll();
  game.scale.setScreenSize(false);

  map = game.add.tilemap('map');

  map.addTilesetImage('stars');

  layer = map.createLayer('Tile Layer 1');
  layer = map.createLayer('Tile Layer 2');

  layer.resizeWorld();

  game.physics.p2.convertTilemap(map, layer);

  ship = game.add.sprite(800, 800, 'ship');
  ship.animations.add('forward',[1,2,3,4,5,6],6,true);
  ship.animations.add('reverse',[7,8,9,10,11,12],6,true);
  ship.animations.add('unpowered',[0],0,false);
  ship.animations.play('unpowered');

  game.physics.p2.applyDamping = false;
  game.physics.p2.applyGravity = false;

  ship.anchor.setTo(0.5, 0.5);
  ship.scale.setTo(0.5, 0.5);

  game.physics.p2.enable(ship);

  // Make the default camera follow the ufo.
  game.camera.follow(ship);

  cursors = game.input.keyboard.createCursorKeys();
  upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
  downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
  leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
  rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
}

function preload() {
  game.load.image('stars', 'assets/imgs/playspace.png');
  //game.load.image('ship', 'assets/imgs/ship.png');
  game.load.spritesheet('ship', 'assets/imgs/ship-sprite.png', 75, 85, 13);
  game.load.tilemap('map', 'assets/tilemaps/map.json', null, Phaser.Tilemap.TILED_JSON);
}

function update() {
  var thrusting = false;

  if (cursors.left.isDown || leftKey.isDown)
  {
      ship.body.rotateLeft(100);
  }
  else if (cursors.right.isDown || rightKey.isDown)
  {
      ship.body.rotateRight(100);
  }
  else
  {
      ship.body.setZeroRotation();
  }

  if (cursors.up.isDown || upKey.isDown)
  {
      ship.body.thrust(400);
      ship.animations.play('forward');
      thrusting = true;
  }
  else if (cursors.down.isDown || downKey.isDown)
  {
      ship.body.reverse(100);
      thrusting = true;
      ship.animations.play('reverse');
  }

  if (!thrusting) {
    ship.animations.play('unpowered');

    if (Math.abs(ship.body.velocity.x) < 0.4) {
      ship.body.velocity.x = 0;
    }
    if (Math.abs(ship.body.velocity.y) < 0.4) {
      ship.body.velocity.y = 0;
    }
  }
}