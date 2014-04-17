/*global create,preload,update */
'use strict';

var soi;

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

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', {
  'create': create,
  'preload': preload,
  'update': update,
  'render': render
});

soi = new Penult.Soi(game);