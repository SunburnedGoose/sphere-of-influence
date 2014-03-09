'use strict';

angular.module('sphereOfInfluenceApp')
  .service('soiPlayerService', [function soiPlayerService() {
    var players = {
      'local': null,
      'networked': []
    };

    function Player(name) {
      this.id = '';
      this.name = name;
      this.location = {
        'x': 0,
        'y': 0
      };
      this.dimensions = {
        'width': 41,
        'height': 27
      };
    }

    var sbg = new Player('Sunburned Goose');
    sbg.id = 'sbg';
    sbg.location.x = 384;
    sbg.location.y = 200;

    players.local = sbg;

    return players;
  }]);
