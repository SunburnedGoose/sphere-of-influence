app.directive('soiSpace',  ['soiCelestialBodyService', 'soiFunctionService', function(cbs, funcs) {
  return {
    'restrict': 'EA',
    'link': function(scope, element, attr) {
      scope.$watch(attr.barycenterX, function(newValue) {
        scope.barycenterX = newValue;
      });
      scope.$watch(attr.barycenterY, function(newValue) {
        scope.barycenterY = newValue;
      });
    }
  };
}]);