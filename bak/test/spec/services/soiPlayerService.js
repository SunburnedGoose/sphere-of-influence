'use strict';

describe('Service: soiPlayerService', function () {

  // load the service's module
  beforeEach(module('sphereOfInfluenceApp'));

  // instantiate service
  var soiPlayerService;
  beforeEach(inject(function (_soiPlayerService_) {
    soiPlayerService = _soiPlayerService_;
  }));

  it('should do something', function () {
    expect(!!soiPlayerService).toBe(true);
  });

});
