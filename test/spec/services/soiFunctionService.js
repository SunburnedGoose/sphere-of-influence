'use strict';

describe('Service: soiFunctionService', function () {

  // load the service's module
  beforeEach(module('sphereOfInfluenceApp'));

  // instantiate service
  var soiFunctionService;
  beforeEach(inject(function (_soiFunctionService_) {
    soiFunctionService = _soiFunctionService_;
  }));

  it('should do something', function () {
    expect(!!soiFunctionService).toBe(true);
  });

});
