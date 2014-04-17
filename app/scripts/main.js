var cursors;
var ship;
var tilesprite;
var speed;
var map;
var player;
var planetoid;

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', {
  'create': create,
  'preload': preload,
  'update': update,
  'render': render
});

var soi = new Penult.Soi(game);

function create() {
  soi.create();
}

function preload() {
  soi.preload();
}

function update() {
  soi.update();
}

function render() {
  // game.debug.geom(new Phaser.Point(1022, 1022), 'rgba(255,0,0,1)');
  // game.debug.cameraInfo(game.camera, 32, 32);
  // game.debug.spriteBounds(ship);
  // game.debug.spriteBounds(soi.heavenlyBodies[0].sprite);
  // game.debug.spriteInfo(ship, 32, 300)
  // var a = getCenterPoint(ship);
  // var b = getCenterPoint(soi.heavenlyBodies[0].gravityWell.sprite);
  // game.debug.text( "Ship - x:" + parseInt(a.x) + " y:" + parseInt(a.y), 32, 400 );
  // game.debug.text( "Planetoid - x:" + parseInt(b.x) + " y:" + parseInt(b.y), 32, 440 );
  // game.debug.geom( a, 'rgba(0,0,255,1)' ) ;
  // game.debug.geom( b, 'rgba(255,0,0,1)' ) ;
  // game.debug.text( "Distance - " + parseInt(game.physics.arcade.distanceBetween(getCenterPoint(ship),getCenterPoint(soi.heavenlyBodies[0].sprite))), 32, 480 );
}

function checkOverlap(b1, b2) {
  var name = (b1.sprite && b2.sprite) ? b1.sprite.name + '|' + b2.sprite.name : '';

  switch (name) {
    case 'ship|well':
    case 'well|ship':
      isShipInWell(b1, b2);
      return false;
      break;
    default:
      return true;
  }
}

function isShipInWell(b1, b2) {
  var ship = (b1.sprite.name === 'ship') ? b1 : b2;
  var well = (b2.sprite.name === 'well') ? b2 : b1;

  var distanceFromSurface = game.physics.arcade.distanceBetween(getCenterPoint(ship.sprite), getCenterPoint(well.sprite));

  soi.ships[0].inSoi = distanceFromSurface <= (well.sprite.width / 2);
}

function getCenterPoint(sprite) {
  var x = sprite.x + ((!sprite.body) ? sprite.width / 2 : 0);
  var y = sprite.y + ((!sprite.body) ? sprite.height / 2 : 0);
  return new Phaser.Point(x,y);
}

// function getNewContext(width, height) {
//   var tempCanvas = document.createElement('canvas');
//   tempCanvas.width = width;
//   tempCanvas.height = height;
//   var context = tempCanvas.getContext('2d');
//   context.toSprite = function(scaleMode) {
//     return new PIXI.Sprite(PIXI.Texture.fromCanvas(this.canvas, scaleMode));
//   };
//   return context;
// }

// function generatePlanetSprite(planetRadius) {
//   var planetContext = getNewContext(512, 512);
//   planetContext.fillStyle = '#FFFFFF';
//   planetContext.beginPath();
//   // draw some stuff, e.g.
//   planetContext.arc(1700 + Math.random() * Math.cos(2) * (planetRadius - 20), 1700 + Math.random() * Math.sin(2) * (planetRadius  - 20), 20, 0, Math.PI * 2);
//   planetContext.closePath();
//   planetContext.fill();

//   return planetContext.toSprite();
// }