'use strict';

angular.module('sphereOfInfluenceApp')
  .directive('soiCelestialBody', function () {
    return {
      template: '<div></div>',
      restrict: 'EA',
      link: function postLink(scope, element) {
        element.text('this is the soiCelestialBody directive');
      }
    };
  });
