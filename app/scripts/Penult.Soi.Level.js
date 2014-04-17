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

  this.game.physics.p2.convertTilemap(this.map, layer);

};