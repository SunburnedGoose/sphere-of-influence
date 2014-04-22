'use strict';

var soi;
var game;

game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', {
  'create': function () {
    soi.create();
  },
  'preload': function () {
    soi.preload();
  },
  'update': function () {
    soi.update();
  },
  'render': function () {
    // var ship = soi.ships[0];
    // var planet = soi.heavenlyBodies[0];
    // var f = soi.Utilities.calculateForce(ship, planet);
    // var sCenter = soi.Utilities.getCenterPoint(ship.sprite);
    // var pCenter = soi.Utilities.getCenterPoint(planet.sprite);
    // var wCenter = soi.Utilities.getCenterPoint(planet.gravityWell.sprite);
    // var angle = Phaser.Math.angleBetweenPoints(sCenter, pCenter) + Math.PI / 2;

    // game.debug.text('force x: ' + parseFloat(f.x).toFixed(4), 32, 32);
    // game.debug.text('force y: ' + parseFloat(f.y).toFixed(4), 32, 54);
    // game.debug.text('vel x: ' + parseFloat(ship.sprite.body.velocity.x).toFixed(4), 250, 32);
    // game.debug.text('vel y: ' + parseFloat(ship.sprite.body.velocity.y).toFixed(4), 250, 54);
    // game.debug.text('angle-r: ' + angle.toFixed(4), 32, 76);
    // game.debug.text('angle-d: ' + Phaser.Math.radToDeg(angle).toFixed(4), 32, 98);

    // game.debug.geom(sCenter, 'rgba(0,0,255,1)' );
    // game.debug.geom(pCenter, 'rgba(255,0,0,1)' );
    // game.debug.geom(wCenter, 'rgba(0,255,0,1)' );

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
});

soi = new Penult.Soi(game);