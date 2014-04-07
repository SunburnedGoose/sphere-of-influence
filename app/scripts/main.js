var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', {'create': create, 'preload': preload, 'update': update});
var cursors;
var ship;
var tilesprite;
var speed;
var map;
var layer;
var planetoid;

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

  planetoid = game.add.sprite(900, 900, 'planetoid');
  ship = game.add.sprite(600, 800, 'ship');
  ship.animations.add('forward',[1,2,3,4,5,6],6,true);
  ship.animations.add('reverse',[7,8,9,10,11,12],6,true);
  ship.animations.add('unpowered',[0],0,false);
  ship.animations.play('unpowered');

  game.physics.p2.applyDamping = false;
  game.physics.p2.applyGravity = false;

  //ship.anchor.setTo(0.25, 0.25);
  ship.scale.setTo(0.25, 0.25);
  planetoid.scale.setTo(0.75,0.75);

  game.physics.p2.enable([ship]);


  // Make the default camera follow the ufo.
  game.camera.follow(ship);

  cursors = game.input.keyboard.createCursorKeys();
  upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
  downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
  leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
  rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);

  game.input.addPointer();
  game.input.onDown.add(changeVector);
  game.input.onHold.add(changeVector);
}

function changeVector(a) {
  ship.body.velocity.x = ship.body.velocity.y = 0;
  var x1 = 400;
  var y1 = 300;
  var x2 = a.position.x;
  var y2 = a.position.y;

  var deltaX = x2 - x1;
  var deltaY = y2 - y1;

  var degrees = Math.atan2(deltaY, deltaX) * 180 / Math.PI + 90;

  var rotation = Phaser.Math.degToRad(degrees);

  ship.body.rotation = rotation;
  update();
}

function preload() {
  game.load.image('stars', 'assets/imgs/playspace.png');
  game.load.image('planetoid', 'assets/imgs/planetoid.png');
  //game.load.image('ship', 'assets/imgs/ship.png');
  game.load.spritesheet('ship', 'assets/imgs/ship-sprite.png', 75, 85, 13);
  game.load.tilemap('map', 'assets/tilemaps/map.json', null, Phaser.Tilemap.TILED_JSON);
}

function update() {
  var thrusting = false;

  if (cursors.left.isDown || leftKey.isDown)
  {
      ship.body.rotateLeft(speed * 10);
  }
  else if (cursors.right.isDown || rightKey.isDown)
  {
      ship.body.rotateRight(speed * 10);
  }
  else
  {
      ship.body.setZeroRotation();
  }

  if (cursors.up.isDown || upKey.isDown || game.input.pointer1.isDown || game.input.mousePointer.isDown)
  {
      ship.body.thrust(speed * 8);
      ship.animations.play('forward');
      thrusting = true;
  }
  else if (cursors.down.isDown || downKey.isDown)
  {
      ship.body.reverse(speed * 2);
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

  if (planetoid.isCamera) {
    planetoid.body.velocity.x = planetoid.body.velocity.y = 0;
  }
}