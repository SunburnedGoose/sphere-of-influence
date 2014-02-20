'use strict';

describe('Directive: soiCelestialSphere', function () {

  // load the directive's module
  beforeEach(module('sphereOfInfluenceApp'));
  beforeEach(module('sphereOfInfluenceApp', 'app/templates/soiCelestialSphere.html'));
  beforeEach(module('sphereOfInfluenceApp', 'app/templates/soiCelestialBody.html'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope, $templateCache) {
    scope = $rootScope.$new();
    var template = $templateCache.get('app/templates/soiCelestialSphere.html');
    $templateCache.put('templates/soiCelestialSphere.html', template);

    template = $templateCache.get('app/templates/soiCelestialBody.html');
    $templateCache.put('templates/soiCelestialBody.html', template);

  }));

  // it('should exist.', inject(function ($compile) {
  //   element = angular.element('<soi-celestial-sphere></soi-celestial-sphere>');
  //   element = $compile(element)(scope);
  //   scope.$digest();
  //   expect(element.text().trim()).toBe('Derp');
  // }));

  it('should have default barycenter coordinates.', inject(function ($compile) {
    element = angular.element('<soi-celestial-sphere></soi-celestial-sphere>');
    element = $compile(element)(scope);
    scope.$digest();
    expect(scope.barycenterX).toBe(0);
    expect(scope.barycenterY).toBe(9800);
  }));

  it('should have custom barycenter coordinates with defined container width.', inject(function ($compile) {
    element = angular.element('<soi-celestial-sphere style="display: block; width: 700px;"></soi-celestial-sphere>');
    element = $compile(element)(scope);
    scope.$digest();
    expect(scope.barycenterX).toBe(350);
    expect(scope.barycenterY).toBe(9800);
  }));

  it('should have custom barycenter coordinates.', inject(function ($compile) {
    element = angular.element('<soi-celestial-sphere barycenter-x="500" barycenter-y="9600"></soi-celestial-sphere>');
    element = $compile(element)(scope);
    scope.$digest();
    expect(scope.barycenterX).toBe(500);
    expect(scope.barycenterY).toBe(9600);
  }));
});
