var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', {
  'create': create,
  'preload': preload,
  'update': update,
  'render': render
});
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

  planetoid = game.add.sprite(1900, 1900, 'planetoid');
  ship = game.add.sprite(1600, 1800, 'ship');
  ship.animations.add('forward',[1,2,3,4,5,6],6,true);
  ship.animations.add('reverse',[7,8,9,10,11,12],6,true);
  ship.animations.add('unpowered',[0],0,false);
  ship.animations.play('unpowered');

  game.physics.p2.applyDamping = false;
  game.physics.p2.applyGravity = false;

  game.physics.p2.enable([ship]);

  ship.scale.setTo(0.25, 0.25);
  planetoid.scale.setTo(0.75,0.75);


// var shape = game.add.graphics(0, 0);  //init rect
// shape.lineStyle(2, 0x0000FF, 1); // width, color (0x0000FF), alpha (0 -> 1) // required settings
// shape.beginFill(0xFFFF0B, 1);
//myBitmap.drawCircle(1700, 1700, 50);
// var circleGraphics = game.add.graphics(200, 40);
// circleGraphics.beginFill(0xfff000);
// circleGraphics.drawCircle(1700, 1700, 20);
// circleGraphics.endFill();

// var planetSprite = generatePlanetSprite(planetRadius);

//   var s = new Phaser.Sprite(game, 1700, 1700, planetSprite);
//   game.add

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
  //ship.body.velocity.x = ship.body.velocity.y = 0;
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
  }

  if (planetoid.inCamera) {
    var s = getCenterPoint(ship);
    var p = getCenterPoint(planetoid);
    var r = planetoid.width / 2;
    var distance = game.physics.arcade.distanceBetween(s,p) - r;
    var acc = 2;

    var xQuad = (s.x < p.x) ? -1 : 1;
    var yQuad = (s.y < p.y) ? -1 : 1;

    if (distance > 0 && distance < planetoid.width) {
      var force = acc * Math.abs((planetoid.width - distance) / planetoid.width);
      ship.body.data.applyForce([force * xQuad, force * yQuad], new Phaser.Point(1022,1022));
      ship.body.angularForce = 0;
    }
  } else {
    if (!thrusting) {
      if (Math.abs(ship.body.velocity.x) < 0.2) {
        ship.body.velocity.x = 0;
      }
      if (Math.abs(ship.body.velocity.y) < 0.2) {
        ship.body.velocity.y = 0;
      }
    }
  }
}

function render() {
  //game.debug.cameraInfo(game.camera, 32, 32);
  //game.debug.spriteInfo(ship, 32, 32);
  // game.debug.spriteBounds(ship);
  // game.debug.spriteBounds(planetoid);
  // game.debug.spriteInfo(ship, 32, 300)
  // game.debug.spriteCoords(ship, 32, 32);
  // var a = getCenterPoint(ship);
  // var b = getCenterPoint(planetoid);
  // game.debug.text( "Ship - x:" + a.x + " y:" + a.y, 32, 400 );
  // game.debug.text( "Planetoid - x:" + b.x + " y:" + b.y, 32, 440 );
  // game.debug.geom( a, 'rgba(0,0,255,1)' ) ;
  // game.debug.geom( b, 'rgba(255,0,0,1)' ) ;
  // game.debug.text( "Distance - " + game.physics.arcade.distanceBetween(getCenterPoint(ship),getCenterPoint(planetoid)), 32, 480 );
}

function getCenterPoint(sprite) {
  var x = sprite.x + ((!sprite.body) ? sprite.width / 2 : 0);
  var y = sprite.y + ((!sprite.body) ? sprite.height / 2 : 0);
  return new Phaser.Point(x,y);
}

function getNewContext(width, height) {
  var tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  var context = tempCanvas.getContext('2d');
  context.toSprite = function(scaleMode) {
    return new PIXI.Sprite(PIXI.Texture.fromCanvas(this.canvas, scaleMode));
  };
  return context;
}

function generatePlanetSprite(planetRadius) {
  var planetContext = getNewContext(512, 512);
  planetContext.fillStyle = '#FFFFFF';
  planetContext.beginPath();
  // draw some stuff, e.g.
  planetContext.arc(1700 + Math.random() * Math.cos(2) * (planetRadius - 20), 1700 + Math.random() * Math.sin(2) * (planetRadius  - 20), 20, 0, Math.PI * 2);
  planetContext.closePath();
  planetContext.fill();

  return planetContext.toSprite();
}