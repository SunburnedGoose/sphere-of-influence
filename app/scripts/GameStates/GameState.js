'use strict';

namespace('Soi.GameStates');

Soi.GameStates.GameState = function() {
  Phaser.State.call(this);
};

Soi.GameStates.GameState.prototype = Object.create(Phaser.State.prototype);

Soi.GameStates.GameState.prototype.constructor = Soi.GameStates.GameState;