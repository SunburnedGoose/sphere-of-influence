var app = angular.module('soi', []);

app.controller('MainCtrl', ['$scope', 'soiCelestialBodyService', function($scope, cbs) {
  $scope.tnos = [cbs.planets[0], cbs.planets[1]];
}]);
