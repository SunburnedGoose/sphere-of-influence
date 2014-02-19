

app.directive('soiOrbit', ['soiFunctionService', function(funcs) {
  return {
    restrict: 'EA',
    scope: {
      body: "="
    },
    templateUrl: 'soiOrbit.html',
    controller: function($scope) {
      var width = parseInt(scope.body.coordinates[0]) / 210 * element.parent().width();
      var height = parseInt(scope.body.coordinates[1]) / 100 * element.parent().width();
      element.find('.arc').attr("d", funcs.describeArc(500, 10000, 9800 - width, -10, 10));
    }
  };
}]);