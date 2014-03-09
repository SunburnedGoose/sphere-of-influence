'use strict';

angular.module('sphereOfInfluenceApp')
  .service('soiCelestialBodyService', [function soiCelestialBodyService() {
    var celestialBodies = {
      'sun': null,
      'planets': [],
      'derelics': [],
      'anomolies': []
    };

    function CelestialBody(name) {
      this.id = '';
      this.name = name;
      this.radius = -1;
      this.mass = -1;
      this.sma = -1;
      this.axialTilt = 0;
    }

    var sun = new CelestialBody('Sun');
    sun.id = 'sun';
    sun.mass = 1.99e30;
    sun.radius = 696342;
    sun.sma = 0;
    sun.axialTilt = 0;

    var alpha = new CelestialBody('721045 SA2048');
    alpha.id = 'alpha';
    alpha.mass = 2.14e21;
    alpha.radius = 555;
    alpha.sma = 7.17e9;
    alpha.location = {
      'x': 150,
      'y': 200
    };
    alpha.axialTilt = 30;

    var beta = new CelestialBody('110607 Hayden');
    beta.id = 'beta';
    beta.mass = 5.67e21;
    beta.radius = 863;
    beta.sma = 6.5e9;
    beta.location = {
      'x': 1000,
      'y': 400
    };
    beta.axialTilt = 30;

    var gamma = new CelestialBody('1982857 Goos');
    gamma.id = 'gamma';
    gamma.mass = 3.19e21;
    gamma.radius = 715;
    gamma.sma = 6.85e9;
    gamma.location = {
      'x': 350,
      'y': 0
    };
    gamma.axialTilt = 30;

    celestialBodies.sun = sun;
    celestialBodies.planets.push(alpha);
    celestialBodies.planets.push(beta);
    celestialBodies.planets.push(gamma);

    return celestialBodies;
  }]);
