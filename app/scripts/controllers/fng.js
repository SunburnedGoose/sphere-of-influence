'use strict';

angular.module('sphereOfInfluenceApp')
  .controller('FngCtrl', ['$scope', 'soiCelestialBodyService', function ($scope, celestialBodyService) {
    $scope.celestialBodies = [celestialBodyService.planets[0], celestialBodyService.planets[1]];
  }]);
