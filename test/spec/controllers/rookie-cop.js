'use strict';

describe('Controller: RookieCopCtrl', function () {

  // load the controller's module
  beforeEach(module('sphereOfInfluenceApp'));

  var RookieCopCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RookieCopCtrl = $controller('RookieCopCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
