'use strict';

angular.module('sphereOfInfluenceApp')
  .directive('soiPlayer', function () {
    return {
      templateUrl: 'templates/soiPlayer.html',
      restrict: 'E',
      link: function postLink() {
        //element.text('this is the soiPlayer directive');
      }
    };
  });
