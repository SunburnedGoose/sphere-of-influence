'use strict';

angular.module('sphereOfInfluenceApp')
  .directive('soiCelestialBody', function () {
    return {
      'requires': '^soiCelestialSphere',
      'templateUrl': 'templates/soiCelestialBody.html',
      'restrict': 'EA',
      'scope': {
        'celestialBody': '='
      }
    };
  });
