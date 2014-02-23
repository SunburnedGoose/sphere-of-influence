'use strict';

describe('Directive: soiCelestialSphere', function () {

  var pages = ['soiCelestialSphere', 'soiCelestialBody', 'soiPlayer'];

  // load the directive's module
  beforeEach(module('sphereOfInfluenceApp'));

  _.forEach(pages, function(page) {
    beforeEach(module('sphereOfInfluenceApp', 'app/templates/' + page + '.html'));
  });

  // var element,
  //   scope;
  var scope;

  beforeEach(inject(function ($rootScope, $templateCache) {
    scope = $rootScope.$new();

    _.forEach(pages, function(page) {
      $templateCache.put('templates/' + page + '.html', $templateCache.get('app/templates/' + page + '.html'));
    });

  }));

  // it('should exist.', inject(function ($compile) {
  //   element = angular.element('<soi-celestial-sphere></soi-celestial-sphere>');
  //   element = $compile(element)(scope);
  //   scope.$digest();
  //   expect(element.text().trim()).toBe('Derp');
  // }));

  // it('should have default barycenter coordinates.', inject(function ($compile) {
  //   element = angular.element('<soi-celestial-sphere></soi-celestial-sphere>');
  //   element = $compile(element)(scope);
  //   scope.$digest();
  //   expect(scope.barycenterX).toBe(0);
  //   expect(scope.barycenterY).toBe(9800);
  // }));

  // it('should have custom barycenter coordinates with defined container width.', inject(function ($compile) {
  //   element = angular.element('<soi-celestial-sphere style="display: block; width: 700px;"></soi-celestial-sphere>');
  //   element = $compile(element)(scope);
  //   scope.$digest();
  //   expect(scope.barycenterX).toBe(350);
  //   expect(scope.barycenterY).toBe(9800);
  // }));

  // it('should have custom barycenter coordinates.', inject(function ($compile) {
  //   element = angular.element('<soi-celestial-sphere barycenter-x="500" barycenter-y="9600"></soi-celestial-sphere>');
  //   element = $compile(element)(scope);
  //   scope.$digest();
  //   expect(scope.barycenterX).toBe(500);
  //   expect(scope.barycenterY).toBe(9600);
  // }));
});
