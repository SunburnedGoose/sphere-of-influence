'use strict';

describe('Directive: soiCelestialSphere', function () {

  // load the directive's module
  beforeEach(module('sphereOfInfluenceApp'));
  beforeEach(module('sphereOfInfluenceApp', 'app/views/soiCelestialSphere.html'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope, $templateCache) {
    scope = $rootScope.$new();
    var template = $templateCache.get('app/views/soiCelestialSphere.html');
    $templateCache.put('views/soiCelestialSphere.html',template);

  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<soi-celestial-sphere></soi-celestial-sphere>');
    element = $compile(element)(scope);
    scope.$digest();
    console.log('post compile', element.html());
    expect(element.text().trim()).toBe('Derp');
  }));
});
