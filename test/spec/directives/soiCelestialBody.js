'use strict';

describe('Directive: soiCelestialBody', function () {

  // load the directive's module
  beforeEach(module('sphereOfInfluenceApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<soi-celestial-body></soi-celestial-body>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the soiCelestialBody directive');
  }));
});
