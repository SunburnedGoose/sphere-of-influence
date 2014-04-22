'use strict';

Penult.Soi.Level = function (game, instance) {
  this.game = game;
  this.instance = instance;

  this.map = undefined;
};

Penult.Soi.Level.prototype = {};

Penult.Soi.Level.prototype.create = function () {
  this.map = this.game.add.tilemap('map');

  this.map.addTilesetImage('stars');

  var layer = this.map.createLayer('Tile Layer 1');

  layer = this.map.createLayer('Tile Layer 2');

  layer.resizeWorld();
  
  /* Build our text layers */
  
  var score = 	this.game.add.sprite(0,0);
  var health = 	lang.en.health+": 100%";
  var style = 	{ font: "15px Arial", fill: "#FFF", align: "center" };
  
  score.fixedToCamera = true;
  health = this.game.add.text(0,0,health,style);
  score.addChild(health);  
  score.cameraOffset.x = 10;
  score.cameraOffset.y = 10;



};