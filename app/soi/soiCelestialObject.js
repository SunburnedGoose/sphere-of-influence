app.directive('soiCelestialObject',  ['soiCelestialBodyService', 'soiFunctionService', function(cbs, funcs) {
  return {
    'requires': '^soiSpace',
    'restrict': 'EA',
    'scope': {
      'barycenterX': '@',
      'barycenterY': '@',
      'body': "="
    },
    'templateUrl': 'soiCelestialObject.html',
    'controller': function($scope) {
      $scope.soiRadius = function(refBody) {
        if (_.isEmpty(refBody)) {
          refBody = cbs.sun;
        }

        var majorBody = null;
        var minorBody = null;
        var distance = 0;

        if (refBody.mass > $scope.body.mass) {
          majorBody = refBody;
          minorBody = $scope.body;
        } else {
          majorBody = $scope.body;
          minorBody = refBody;
        }

        if (refBody.id === 'sun') {
          distance = $scope.body.sma;
        } else {
          // TODO
          // Calculate distance between two bodies
          // on the screen.
        }

        var soiRadius = distance * Math.pow((minorBody.mass / majorBody.mass), .4);

        return (soiRadius / 9000);
      }
    },
    'link': function(scope, element, attr) {
      if (!element.hasClass('celestial-object')) {
        element.addClass('celestial-object');
      }

      var body = element.find('.celestial-body');

      scope.body.soiRadius = scope.soiRadius();
      element.css('left', scope.body.coordinates[0]);
      element.css('top', scope.body.coordinates[1]);
      element.css('width', Math.floor(scope.body.soiRadius) + 'px');
      element.css('height', Math.floor(scope.body.soiRadius) + 'px');

      body.css('width', Math.floor(scope.body.radius * .06));
      body.css('height', Math.floor(scope.body.radius * .06));
      body.css('border-radius', Math.floor(scope.body.radius * .06));
      body.css('box-shadow', '#000 ' + Math.floor(scope.body.radius * .007) + 'px ' + Math.floor(scope.body.radius * .007) + 'px ' + Math.floor(scope.body.radius * .035) + 'px 0 inset, rgba(255,150,0,0.7) ' +
        '0 0 ' + Math.floor(scope.body.radius * .06) + 'px ' + Math.floor(scope.body.radius * .004) + 'px');
    }
  };
}]);