'use strict';

angular.module('sphereOfInfluenceApp')
  .directive('soiGameArea', ['soiFunctionService', function (funcs) {
    return {
      'templateUrl': 'templates/soiGameArea.html',
      'restrict': 'E',
      'controller': ['$scope', function($scope) {
        var gameArea = $('#gameArea');

        $scope.movePlayer = function(e) {
          $scope.$emit('soi.MOVE_TO', {
            'x': (e.pageX - gameArea.offset().left) / $scope.scale,
            'y': (e.pageY - gameArea.offset().top) / $scope.scale
          });
        };

        $scope.movePlayerTowards = function (e) {
          // if (!e.clicking) {
          //   return;
          // }
          $scope.$emit('soi.MOVE_TO', {
            'x': (e.pageX - gameArea.offset().left) / $scope.scale,
            'y': (e.pageY - gameArea.offset().top) / $scope.scale
          });
        };

        // $scope.movePlayerTowards2 = function () {
        //   // if (!e.clicking) {
        //   //   return;
        //   // }
        //   $('#statsPanel div').text('Hi');
        // };

        $scope.doNothing = function(e) {
          e.preventDefault();
          e.stopPropagation();
        };

        $(window).resize(function() {
          $scope.scale = funcs.viewport().scale;
          $scope.$digest();
        });
      }],
      'link': function postLink(scope, element) {
        function resizeGame() {
          var gameArea = element.find('#gameArea').get(0);
          var widthToHeight = 16 / 9;
          var newWidth = window.innerWidth;
          var newHeight = window.innerHeight;
          var newWidthToHeight = newWidth / newHeight;

          if (newWidthToHeight > widthToHeight) {
            newWidth = (newHeight * widthToHeight);
            gameArea.style.height = (newHeight) + 'px';
            gameArea.style.width = newWidth + 'px';
          } else {
            newHeight = (newWidth / widthToHeight);
            gameArea.style.width = newWidth + 'px';
            gameArea.style.height = newHeight + 'px';
          }

          gameArea.style.marginTop = (-newHeight / 2) + 'px';
          gameArea.style.marginLeft = (-newWidth / 2) + 'px';
          gameArea.style.fontSize = (newWidth / 400) + 'em';

          var gameCanvas = element.find('#gameCanvas').get(0);
          gameCanvas.width = newWidth;
          gameCanvas.height = newHeight;

          var statsPanel = element.find('#statsPanel').get(0);
          statsPanel.style.height = (newHeight * 0.08) + 'px';
          statsPanel.style.lineHeight = (newHeight * 0.08) + 'px';
        }

        resizeGame();

        window.addEventListener('resize', function() { resizeGame(); scope.$digest(); }, false);
        window.addEventListener('orientationchange', function() { resizeGame(); scope.$digest(); }, false);


        // FastClick.attach(element.get(0));

        $(element).bind('touchmove', function(e) {
          var o = e.originalEvent.changedTouches[0];
          var ele = element.find('#gameArea');
          var x = (o.pageX - ele.offset().left) / scope.scale;
          var y = (o.pageY - ele.offset().top) / scope.scale;

          scope.$emit('soi.MOVE_TO', {
            'x': x,
            'y': y
          });

          e.preventDefault();
          e.stopPropagation();

          scope.$digest();
        });
      }
    };
  }]);
