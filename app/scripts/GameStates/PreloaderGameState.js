'use strict';

namespace('Soi.GameStates');

Soi.GameStates.PreloaderGameState = function() {
  Soi.GameStates.GameState.call(this);
};

Soi.GameStates.PreloaderGameState.prototype = Object.create(Soi.GameStates.GameState.prototype);

Soi.GameStates.PreloaderGameState.prototype.constructor = Soi.GameStates.PreloaderGameState;

Soi.GameStates.PreloaderGameState.prototype.preload = function() {
  if (this.game.device.desktop) {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.minWidth = 540;
    this.scale.minHeight = 360;
    this.scale.maxWidth = 900;
    this.scale.maxHeight = 600;
    this.scale.setScreenSize(true);
  } else {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.minWidth = 360;
    this.scale.minHeight = 240;
    this.scale.maxWidth = 900;
    this.scale.maxHeight = 600;
    this.scale.hasResized.add(function() {}, this);
    this.scale.enterIncorrectOrientation.add(function() {}, this);
    this.scale.leaveIncorrectOrientation.add(function() {}, this);
    this.scale.setScreenSize(true);
  }

  var gameCenter = new Phaser.Point(this.game.width / 2, this.game.height / 2);

  this.preloadBarAlpha = this.add.sprite(gameCenter.x, gameCenter.y, 'preloaderBar');
  this.preloadBarAlpha.anchor.setTo(0.5, 0.5);
  this.preloadBarAlpha.alpha = 0.3;

  this.preloadBar = this.add.sprite(gameCenter.x, gameCenter.y, 'preloaderBar');
  this.preloadBar.anchor.setTo(0.5, 0.5);

  this.load.setPreloadSprite(this.preloadBar);

  var a = '1987';

  this.load.image('layer-menu', 'assets/imgs/layer-menu.png?' + a);
  this.load.spritesheet('audio_on', 'assets/imgs/audio_on.png?' + a, 44, 40, 4);
  this.load.spritesheet('audio_muted', 'assets/imgs/audio_muted.png?' + a, 44, 40, 4);
  this.load.audio('all_this', ['assets/audio/all_this.m4a', 'assets/audio/all_this.ogg']);
  this.load.spritesheet('ship', 'assets/imgs/ship-sprite.png?' + a, 26, 56, 13);
  this.load.spritesheet('play_game', 'assets/imgs/play_game.png?' + a, 243, 98, 2);
  this.load.image('titan', 'assets/imgs/titan.png?' + a);
  this.load.image('saturn', 'assets/imgs/saturn.png?' + a);
  this.load.image('saturn-bottom', 'assets/imgs/saturn-bottom.png?' + a);
  this.load.spritesheet('saturn-moons', 'assets/imgs/saturn-moons.png?' + a, 30, 30, 7);
  this.load.image('title', 'assets/imgs/title.png?' + a);
  this.load.image('dot', 'assets/imgs/dot.jpg?' + a);
  this.load.image('saturn-shadow', 'assets/imgs/saturn-shadow.png?' + a);
  this.load.image('beenThere', 'assets/imgs/beenThere.png?' + a);
  this.load.image('goingTo', 'assets/imgs/goingTo.png?' + a);
  this.load.image('shieldbar', 'assets/imgs/shield.png');
  this.load.physics('ship-physics', 'assets/physics/ship.json?' + a);
  this.load.spritesheet('asteroid', 'assets/imgs/asteroid-sprite.png', 60, 75);
  this.load.spritesheet('explosion', 'assets/imgs/explosion-sprite.png', 41, 41);


  this.game.__meta = {
    'spritesheet': {
      'ship': {
        'initial': 'unpowered',
        'animations': [{
          'name': 'unpowered',
          'frames': [0],
          'number': 0,
          'loop': false
        }, {
          'name': 'forward',
          'frames': [1, 2, 3, 4, 5, 6],
          'number': 6,
          'loop': true
        }, {
          'name': 'reverse',
          'frames': [7, 8, 9, 10],
          'number': 4,
          'loop': true
        }, {
          'name': 'right',
          'frames': [11],
          'number': 1,
          'loop': false
        }, {
          'name': 'left',
          'frames': [12],
          'number': 1,
          'loop': false
        }]
      }
    }
  };
};

Soi.GameStates.PreloaderGameState.prototype.create = function() {
  var that = this;

  this.preloadBar.cropEnabled = false;

  this.preloadBarAlpha.kill();

  window.setTimeout(function() {

    that.game.add.tween(that.preloadBar).to({
      alpha: 0
    }, 750, Phaser.Easing.Linear.InOut, true);
  }, 250);

  window.setTimeout(function() {
    that.game.state.start(Soi.GameStates.GameStateTypes.Menu.name);
  }, 2000);
};
