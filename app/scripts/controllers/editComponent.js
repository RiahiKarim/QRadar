'use strict';

angular
  .module('qradarApp')
  .controller('editComponentCtrl', function ($scope, $uibModalInstance, $compile, selectedComponents, componentFetcher, yamlParser, values) {


    var allComponents = {};

    componentFetcher.getAllComponents().then(function (components) {
        allComponents = components;

        // Inject fields types
        $scope.fields = {
            common: allComponents[values.type].fields,
            custom: allComponents[values.type].customFields || null
        };

        // Inject fields values
        $scope.componentNames = Object.keys(selectedComponents.components);
        $scope.values = values;
        $scope.values.custom = values.custom || {};
    });

    $scope.ok = function () {
      $uibModalInstance.close({name: $scope.values.name, values: $scope.values});
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
