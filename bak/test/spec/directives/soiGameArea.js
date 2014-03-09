'use strict';

describe('Directive: soiGameArea', function () {

  // load the directive's module
  beforeEach(module('sphereOfInfluenceApp'));
  beforeEach(module('sphereOfInfluenceApp', 'app/templates/soiGameArea.html'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope, $templateCache) {
    scope = $rootScope.$new();
    var template = $templateCache.get('app/templates/soiGameArea.html');
    $templateCache.put('templates/soiGameArea.html', template);
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<soi-game-area></soi-game-area>');
    element = $compile(element)(scope);
    //expect(element.text()).toBe('this is the soiGameArea directive');
  }));
});
