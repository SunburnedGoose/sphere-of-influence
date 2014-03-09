'use strict';

angular.module('sphereOfInfluenceApp')
  .directive('soiOrbit', [function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element) {
        element.text('this is the soiOrbit directive');
      }
    };
  }]);
