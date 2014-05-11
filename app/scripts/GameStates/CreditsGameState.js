'use strict';

var gameStatesNS = namespace('Soi.GameStates');

gameStatesNS.CreditsGameState = function() {
  gameStatesNS.GameState.call(this);
};

gameStatesNS.CreditsGameState.prototype = Object.create(gameStatesNS.GameState.prototype);
gameStatesNS.CreditsGameState.prototype.constructor = gameStatesNS.CreditsGameState;