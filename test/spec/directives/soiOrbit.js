'use strict';

describe('Directive: soiOrbit', function () {

  // load the directive's module
  beforeEach(module('sphereOfInfluenceApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<soi-orbit></soi-orbit>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the soiOrbit directive');
  }));
});
