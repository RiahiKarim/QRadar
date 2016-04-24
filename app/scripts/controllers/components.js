'use strict';

angular
  .module('qradarApp')
  .controller('componentsCtrl', function ($scope , componentFetcher) {


    $scope.components = [];
    $scope.search = {
        label: ''
    };

    componentFetcher.getAllComponents().then(function (components) {
        for(var i in components) {
            if (components.hasOwnProperty(i)) {
                $scope.components.push(components[i]);
            }
        }
    });
});
