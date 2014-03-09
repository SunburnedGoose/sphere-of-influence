'use strict';

describe('Controller: CubCtrl', function () {

  // load the controller's module
  beforeEach(module('sphereOfInfluenceApp'));

  var CubCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CubCtrl = $controller('CubCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
