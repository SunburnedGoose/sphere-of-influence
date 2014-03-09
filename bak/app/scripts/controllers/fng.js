'use strict';

angular.module('sphereOfInfluenceApp')
  .controller('FngCtrl', ['$scope', 'soiCelestialBodyService', 'soiPlayerService', 'soiFunctionService', function ($scope, cbs, ps, funcs) {
    $scope.celestialBodies = [cbs.planets[0], cbs.planets[1]];
    $scope.players = [ps.local].concat(ps.networked);
    $scope.scale = funcs.viewport().scale;
    $scope.barycenterX = 500;
    $scope.barycenterY = 9800;

    $scope.$on('soi.MOVE_TO', function(event, data) {
      ps.local.location = {
        'x': data.x,
        'y': data.y
      };
    });

    $scope.scaling = function (value) {
      return value * $scope.scale;
    };

    // var that = this;
    // var fps = 100;


    // function PlayerCtrl(game, rigidbody) {
    //   var that = this;
    //   var speed = 10;

    //   that.rigidbody = rigidbody;
    //   that.run = function () {
    //     if (game.isKeyDown(39)) {
    //       that.rigidbody.x += speed;
    //     } else if (game.isKeyDown(37)) {
    //       that.rigidbody.x -= speed;
    //       if (that.rigidbody.x < 0) {
    //         that.rigidbody.x = 0;
    //       }
    //     }

    //     if (game.isKeyDown(38)) {
    //       that.rigidbody.y -= speed;
    //       if (that.rigidbody.y < 0) {
    //         that.rigidbody.y = 0;
    //       }
    //     } else if (game.isKeyDown(40)) {
    //       that.rigidbody.y += speed;
    //     }
    //   };
    // }

    // $scope.gameObjects = [
    //   new PlayerCtrl(that, {
    //     width: 50,
    //     height: 50,
    //     x: 0,
    //     y: 0
    //   })
    // ];
    // that.keys = {};

    // $('body').keydown(function (e) {
    //   that.keys['key' + e.which] = true;
    // });

    // that.isKeyDown = function (code) {
    //   if (that.keys['key' + code]) {
    //     return true;
    //   }

    //   return false;
    // };

    // // Clear KeyEvent
    // function clearKeyEvent() {
    //   for (var code in that.keys) {
    //     if (that.keys.hasOwnProperty(code)) {
    //       that.keys[code] = false;
    //     }
    //   }
    // }

    // // Game Loop
    // function gameLoop() {
    //   var i;

    //   $scope.$apply(function () {
    //     for (i = 0; i < $scope.gameObjects.length; i++) {
    //       $scope.gameObjects[i].run();
    //     }
    //   });

    //   clearKeyEvent();
    // }

    // var interval = setInterval(gameLoop, 1000 / fps);

    // // STOP Game Loop
    // $scope.stop = function () {
    //   clearInterval(interval);
    // };
  }]);
