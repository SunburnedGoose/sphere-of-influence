'use strict';

angular.module('sphereOfInfluenceApp')
  .directive('soiCelestialSphere', function () {
    return {
      templateUrl: 'views/soiCelestialSphere.html',
      restrict: 'EA',
      link: function postLink() {
      }
    };
  });
