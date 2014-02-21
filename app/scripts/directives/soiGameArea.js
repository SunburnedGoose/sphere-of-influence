'use strict';

angular.module('sphereOfInfluenceApp')
  .directive('soiGameArea', function () {
    return {
      templateUrl: 'templates/soiGameArea.html',
      restrict: 'E',
      link: function postLink(scope, element) {
        function resizeGame() {
          var gameArea = element.find('#gameArea').get(0);
          var widthToHeight = 16 / 9;
          var newWidth = window.innerWidth;
          var newHeight = window.innerHeight;
          var newWidthToHeight = newWidth / newHeight;

          if (newWidthToHeight > widthToHeight) {
            newWidth = Math.floor(newHeight * widthToHeight);
            gameArea.style.height = Math.floor(newHeight) + 'px';
            gameArea.style.width = newWidth + 'px';
          } else {
            newHeight = Math.floor(newWidth / widthToHeight);
            gameArea.style.width = newWidth + 'px';
            gameArea.style.height = newHeight + 'px';
          }

          gameArea.style.marginTop = Math.floor(-newHeight / 2) + 'px';
          gameArea.style.marginLeft = Math.floor(-newWidth / 2) + 'px';
          gameArea.style.fontSize = Math.floor(newWidth / 400) + 'em';

          var gameCanvas = element.find('#gameCanvas').get(0);
          gameCanvas.width = newWidth;
          gameCanvas.height = newHeight;

          var statsPanel = element.find('#statsPanel').get(0);
          statsPanel.style.height = Math.floor(newHeight * 0.08) + 'px';
          statsPanel.style.lineHeight = Math.floor(newHeight * 0.08) + 'px';
        }

        resizeGame();

        window.addEventListener('resize', resizeGame, false);
        window.addEventListener('orientationchange', resizeGame, false);

        $(document).bind('touchmove', function(e) {
          e.preventDefault();
        });
      }
    };
  });
