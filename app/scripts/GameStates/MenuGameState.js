'use strict';

namespace('Soi.GameStates');

Soi.GameStates.MenuGameState = function() {
  Soi.GameStates.GameState.call(this);

  // Placeholders for moon variables until they are generated below.
  this.titan = undefined;
  this.rhea = undefined;
  this.hyperion = undefined;
  this.dione = undefined;
  this.tethys = undefined;
  this.enceledus = undefined;
  this.mimas = undefined;

  // Variables used when DEBUG === true
  var debugTime = 2;
  var debugDelay = 0;

  // Variables used to create Moon data.
  this.moons = [{
    'id': 0,
    'name': 'titan',
    'start': {
      'y': 200
    },
    'sScaler': 1.0
  }, {
    'name': 'hyperion',
    'id': 1,
    'start': {
      'y': 210
    },
    'sScaler': 0.5
  }, {
    'name': 'rhea',
    'id': 2,
    'start': {
      'y': 250
    },
    'sScaler': 0.7
  }, {
    'name': 'dione',
    'id': 3,
    'start': {
      'y': 292
    },
    'sScaler': 0.7
  }, {
    'name': 'tethys',
    'id': 4,
    'start': {
      'y': 300
    },
    'sScaler': 0.7
  }, {
    'name': 'enceledus',
    'id': 5,
    'start': {
      'y': 308
    },
    'sScaler': 0.7
  }, {
    'name': 'mimas',
    'id': 6,
    'start': {
      'y': 322
    },
    'sScaler': 0.5
  }, ];

  // Initializes the Moon variables from the variables.
  _.each(this.moons, function(m) {
    // if the moon has the variables
    if (m.start) {
      // 379 is the hardcoded vertical midpoint of the y-axis.
      var yMidPoint = 379;
      var yDelta = (yMidPoint - m.start.y);

      // The edge of the screen is the starting point.
      m.start.x = 900;
      // The midpoint along the ellipse.
      m.mid = {
        'x': m.start.x - (yDelta * 5) - 100,
        'y': yMidPoint
      };
      // The moon returns to the edge of the screen.
      m.end = {
        'x': m.start.x,
        'y': yMidPoint + yDelta
      };

      // Random 0 - 20 second delay start for the moon.
      m.delay = (DEBUG) ? debugDelay : (Math.random() * 20);
      // How long it takes to move around the visible ellipse.
      m.time = (DEBUG) ? debugTime : ((Math.PI * yDelta * 2) / 12);

      // Ellipse definition.
      // m.bezier = [
      //   { 'x': m.start.x, 'y': m.start.y },
      //   { 'x': m.start.x, 'y': m.start.y },
      //   { 'x': m.mid.x,   'y': m.start.y },
      //   { 'x': m.mid.x,   'y': m.mid.y },
      //   { 'x': m.mid.x,   'y': m.end.y },
      //   { 'x': m.end.x,   'y': m.end.y },
      //   { 'x': m.end.x,   'y': m.end.y }
      // ];

      m.bezier = [{
          'x': m.start.x,
          'y': m.start.y
        },
        //{ 'x': m.start.x, 'y': m.start.y },
        {
          'x': m.mid.x,
          'y': m.start.y
        },
        //{ 'x': m.mid.x,   'y': m.mid.y },
        {
          'x': m.mid.x,
          'y': m.end.y
        },
        //{ 'x': m.end.x,   'y': m.end.y },
        {
          'x': m.end.x,
          'y': m.end.y
        }
      ];


      // Find the angle formed from the distance to the moon and the diameter of Saturn.
      var sMid = Math.sin(60 / (yDelta * 5));

      m.shadowDelay = m.time / 2;
      m.shadowRuntime = m.time / 2 * sMid;
      m.shadowRemain = m.time - m.shadowDelay - m.shadowRuntime;
      m.sRuntimeScaler = 0.0;

      // All shadows travel the same path along the surface of Saturn at the moment.
      m.shadow = [{
        'x': 797,
        'y': 374
      }, {
        'x': 797,
        'y': 395
      }, {
        'x': 867,
        'y': 395
      }, {
        'x': 867,
        'y': 395
      }];
    }
  });
};

Soi.GameStates.MenuGameState.prototype = Object.create(Soi.GameStates.GameState.prototype);

Soi.GameStates.MenuGameState.prototype.constructor = Soi.GameStates.MenuGameState;

Soi.GameStates.MenuGameState.prototype.preload = function() {
  this.instance = this.game.instance;
  this.game.load.tilemap('map', 'assets/tilemaps/map.json', null, Phaser.Tilemap.TILED_JSON);
  this.game.load.image('stars', 'assets/imgs/playspace.png');
  this.game.load.image('planetoid', 'assets/imgs/planetoid.png');
  this.game.load.image('gravityWell', 'assets/imgs/aura.png');
  this.game.load.image('neptune', 'assets/imgs/neptune.png');
};

Soi.GameStates.MenuGameState.prototype.create = function() {
  var that = this;
  var gameCenter = new Phaser.Point(this.game.width / 2, this.game.height / 2);

  this.background = this.add.sprite(gameCenter.x, gameCenter.y, 'background-preloader');
  this.background.anchor.setTo(0.5, 0.5);

  this.audioEnabled = this.add.button(this.game.width - 80, 45, 'audio_on', this.audioEnabledClick, this, 0, 1, 2, 3);
  this.audioEnabled.name = 'audio_on';
  this.audioDisabled = this.add.button(this.game.width - 80, 45, 'audio_muted', this.audioDisabledClick, this, 0, 1, 2, 3);
  this.audioDisabled.name = 'audio_muted';

  // Start up the background music.
  this.music = this.game.instance.backgroundAudio;

  if (!DEBUG) {
    this.music.file = this.game.add.audio('all_this');
    this.music.file.play('', 0, this.music.file.volume);
  }

  if (_.has(this.game.instance.storedConfig, 'muted')) {
    this.game.sound.mute = this.game.instance.storedConfig.muted;
  }

  if (this.game.sound.mute) {
    this.audioEnabled.kill();
  } else {
    this.audioDisabled.kill();
  }

  this.menuLayer = this.add.sprite(647, 265, 'saturn');

  // Process the moons and add them to the page.  They are after Saturn so they will be on top of it when they orbit.
  _.each(this.moons, function(m) {
    var moon = that[m.name] = that.add.sprite(m.start.x, m.start.y, 'saturn-moons');
    moon.animations.add(m.name, [m.id], 0, false);
    moon.animations.play(m.name);
    moon.scale.setTo(0.25, 0.25);
    moon.scaler = 0.25;

    var shadow = that[m.name + '-shadow'] = that.add.sprite(m.start.x, m.start.y, 'saturn-shadow');
    shadow.scale.setTo(0.5, 0.5);
  });

  this.playGame = this.add.button(gameCenter.x, gameCenter.y + 100, 'play_game', this.playGameClick, this, 1, 0, 1, 1);
  this.playGame.anchor.setTo(0.5, 0.5);
  this.playGame.name = 'play_game';

  this.title = this.add.sprite(gameCenter.x, gameCenter.y - 100, 'title');
  this.title.anchor.setTo(0.5, 0.5);
  // A small sliver of Saturn was added to allow the moons to go under it when they are behind Saturn.
  this.add.sprite(811, 265, 'saturn-bottom');

  // Add the timelines to support the tweens for the moons.
  _.each(this.moons, function(m) {
    if (m.bezier) {
      var moon = that[m.name];
      var shadow = that[m.name + '-shadow'];

      shadow.scale.setTo(m.sRuntimeScaler, m.sScaler);
      shadow.alpha = 0;

      // Moon timelines
      var a = new TimelineMax({
        'repeat': -1,
        'repeatDelay': m.time
      });

      // Moon orbits
      a.to(moon, m.time, {
          'bezier': {
            'type': 'cubic',
            'values': m.bezier
          },
          'ease': Power1.easeIn,
        },
        'tl');

      // Moon size from small (.25) to large (1.0) during orbit.
      a.to(moon, m.time, {
          'scaler': 1,
          'ease': Circ.easeIn,
          'onUpdate': that.updateTween
        },
        'tl');

      // Shadow timelines
      var b = new TimelineMax({
        'repeat': -1,
        'repeatDelay': m.time + m.shadowRemain + m.shadowDelay,
        'delay': m.time
      });

      // Shadow paths over Saturn
      b.to(shadow, m.shadowRuntime, {
          'bezier': {
            'type': 'cubic',
            'values': m.shadow
          },
          'ease': Power1.easeIn,
        },
        'tl');

      shadow.sRuntimeScaler = m.sRuntimeScaler;
      shadow.sScaler = m.sScaler;

      // Stretching the shadows across Saturn
      b.to(shadow, m.shadowRuntime, {
          'sRuntimeScaler': m.sScaler * 1.5,
          'ease': Power0.easeInOut,
          'onUpdate': that.updateShadow
        },
        'tl');

      // Fast forward each animation to a point 4 to 60 seconds in the future to randomize the moons.
      var ff = Math.floor(Math.random() * (60 - 4 + 1) + 4);
      a.seek(ff);
      // Adjusted for the time the shadow is available on screen.
      b.seek(ff + m.time + m.shadowDelay - m.shadowRuntime);
    }
  });
};

Soi.GameStates.MenuGameState.prototype.updateTween = function() {
  // Scales the moons.
  this.target.scale.setTo(this.target.scaler, this.target.scaler);

  // Adds a path to help identify problems with the orbits.
  if (DEBUG && this.timeline._cycle < 2) {
    var m = this.target;
    m.game.add.sprite(m.x, m.y, 'dot');
  }
};

Soi.GameStates.MenuGameState.prototype.updateShadow = function() {
  // Hides the moon after they are done with the transit of Saturn.
  if (this.timeline.progress() === 1) {
    this.target.alpha = 0;
  } else {
    this.target.alpha = 0.9;
    // Scales the shadows horizontally.
    this.target.scale.setTo(this.target.sRuntimeScaler, this.target.sScaler);
  }
};

Soi.GameStates.MenuGameState.prototype.audioEnabledClick = function() {
  this.game.sound.mute = this.instance.storedConfig.muted = true;
  this.instance.updateStore();
  this.audioEnabled.kill();
  this.audioDisabled.revive();
};

Soi.GameStates.MenuGameState.prototype.audioDisabledClick = function() {
  this.game.sound.mute = this.instance.storedConfig.muted = false;
  this.instance.updateStore();
  this.audioEnabled.revive();
  this.audioDisabled.kill();
};

Soi.GameStates.MenuGameState.prototype.playGameClick = function() {
  var that = this;

  var a = new TimelineMax({
    'onComplete': function() {

      // Don't forget to stop the music.
      if (!DEBUG) {
        if (that.music.file) {
          that.music.file.stop();
        }
      }

      // Let's play the game!
      that.game.state.start(Soi.GameStates.GameStateTypes.Gameplay.name);
    }
  });

  a.to([this.audioEnabled, this.audioDisabled, this.playGame], 0.250, {
    'alpha': 0,
    'ease': Power0.easeIn
  }, 'ta');
  a.to([this.title], 1, {
    'alpha': 0,
    'ease': Power0.easeIn
  }, 'ta');
};
