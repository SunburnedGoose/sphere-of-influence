'use strict';

describe('Service: soiCelestialBodyService', function () {

  // load the service's module
  beforeEach(module('sphereOfInfluenceApp'));

  // instantiate service
  var soiCelestialBodyService;
  beforeEach(inject(function (_soiCelestialBodyService_) {
    soiCelestialBodyService = _soiCelestialBodyService_;
  }));

  it('should do something', function () {
    expect(!!soiCelestialBodyService).toBe(true);
  });

});
