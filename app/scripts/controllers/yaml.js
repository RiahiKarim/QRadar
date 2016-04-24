
'use strict';
angular
  .module('qradarApp')
  .controller('yamlCtrl', function ($scope, selectedComponents, yamlParser) {

    $scope.components = selectedComponents.components;

    $scope.getFileResult = function () {
        var results = {
            applications: {},
            binaries: {}
        };

        // Separate component into applications/binaries
        angular.forEach($scope.components, function (component, name) {
            var componentResult = component.getOutputFields();

            results[component.binary ? 'binaries' : 'applications'][name] = componentResult;
        });

        results = yamlParser.cleanResult(JSON.parse(JSON.stringify(results)));
        results = yamlParser.cleanEmptyObjects(results);
        if (_.isEmpty(results)) {
            results = '';
        }

        return yamlParser.dump(results, 5);
    };

    $scope.generateFile = function () {
        var fakeLink = document.createElement('a');

        fakeLink.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.getFileResult()));
        fakeLink.setAttribute('download', '.gaudi.yml');
        fakeLink.click();
    };
});
