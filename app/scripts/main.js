'use strict';

var DEBUG, game;

DEBUG = false;
game = new Phaser.Game(900, 600, Phaser.AUTO, 'screen');
game.instance = new Soi.Game(game);