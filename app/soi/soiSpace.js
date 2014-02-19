app.directive('soiSpace',  ['soiCelestialBodyService', 'soiFunctionService', function(cbs, funcs) {
  return {
    'restrict': 'EA',
    'link': function(scope, element, attr) {
      scope.$watch(attr.barycenterX, function(newValue) {
        scope.barycenterX = (_.isString(newValue)) ? +newValue : element.width() / 2;
      });
      scope.$watch(attr.barycenterY, function(newValue) {
        scope.barycenterY = (_.isString(newValue)) ? +newValue : 9800;
      });
    }
  };
}]);