'use strict';

namespace('Soi.GameStates');

Soi.GameStates.BootloaderGameState = function() {
  Soi.GameStates.GameState.call(this);
};

Soi.GameStates.BootloaderGameState.prototype = Object.create(Soi.GameStates.GameState.prototype);

Soi.GameStates.BootloaderGameState.prototype.constructor = Soi.GameStates.BootloaderGameState;

Soi.GameStates.BootloaderGameState.prototype.preload = function () {
  this.load.image('background-preloader', 'assets/imgs/background-preloader.jpg');
  this.load.image('preloaderBar', 'assets/imgs/preloader-bar.png');
};

Soi.GameStates.BootloaderGameState.prototype.create = function () {

  this.game.physics.startSystem(Phaser.Physics.P2JS);

  this.game.state.start(Soi.GameStates.GameStateTypes.Preloader.name);
};