'use strict';

describe('Controller: FngCtrl', function () {

  // load the controller's module
  beforeEach(module('sphereOfInfluenceApp'));

  var FngCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FngCtrl = $controller('FngCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.celestialBodies.length).toBe(2);
  });
});
