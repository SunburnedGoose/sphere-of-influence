'use strict';

namespace('Soi');

Soi.Game = function(game) {
  var that = this;
  this.game = game;
  this.lang = {
    'name': 'en',
    'culture': 'us'
  };
  this.currentLang = Soi.Lang[this.lang.name];
  this.backgroundAudio = {
    'file': undefined,
    'isPlaying': false,
    'volume': 0.4
  };

  _.each(Soi.GameStates.GameStateTypes, function(gst) {
    that.game.state.add(gst.name, gst.type, gst.autoStart);
  });

  this.storedConfig = (store.enabled) ? store.get('soi') || {} : {};
};

Soi.Game.prototype = {};
Soi.Game.prototype.constuctor = Soi.Game;

Soi.Game.prototype.updateStore = function() {
  if (store.enabled) {
    store.set('soi', this.storedConfig);
  }
};
