'use strict';

describe('Controller: CoolHandCtrl', function () {

  // load the controller's module
  beforeEach(module('sphereOfInfluenceApp'));

  var CoolHandCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CoolHandCtrl = $controller('CoolHandCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
