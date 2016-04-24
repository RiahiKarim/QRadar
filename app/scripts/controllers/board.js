//
//
//window._            = require('underscore/underscore');
//window.Backbone     = require('backbone');
//window.Backbone.$   = $;
//var graphElement    = require('jointjs/element');
//var graph           = require('jointjs/graph');
//
///*require('angular-bootstrap/src/transition/transition');*/
//require('angular-bootstrap/src/modal/modal');
//require('jointjs/paper');
//require('directives/droppable');
//require('services/selectedComponents');

angular
  .module('qradarApp')
  .controller('boardCtrl', function ($scope ,$uibModal, $window, selectedComponents, componentFetcher,element) {

    $scope.graph = new joint.dia.Graph;



    $scope.components = selectedComponents.components;

    var allComponents = {};

    componentFetcher.getAllComponents().then(function (components) {
        allComponents = components;
    });

    function createLink(targetId) {
        var sourceName = this.get('name'),
            targetName = $scope.graph.getCell(targetId).get('name'),
            source = $scope.components[sourceName],
            target = $scope.components[targetName];

        source.createLink(target);

        $scope.$apply();
    }

    function removeLink(sourceId, targetId) {
        var sourceName = $scope.graph.getCell(sourceId).get('name'),
            targetName = $scope.graph.getCell(targetId).get('name'),
            source = $scope.components[sourceName],
            target = $scope.components[targetName];

        source.removeLink(target);

        $scope.$apply();
    }

    function onRemove() {
        var name = this.get('name'),
            position;

        // Remove element
        delete $scope.components[name];

        // Remove links
        angular.forEach($scope.components, function (component, componentName) {
            if ((position = $.inArray(name, component.links)) >= 0) {
                component.links.splice(position, 1);
            }
        });

        $scope.$apply();
    }

    function onOpenDetail() {
        var componentName = this.get('name'),
            editModal;

        editModal = $uibModal.open({
            templateUrl: '/views/edit-component.html',
            controller: 'editComponentCtrl',
            resolve: {
                values: function () {
                    var values = $scope.components[componentName];
                    values.name = componentName;
                    return values;
                }
            }
        });

        editModal.result.then(function (formData) {
            // Detect component name changes
            if (formData.name !== componentName) {
                delete $scope.components[componentName];

                // Update links name of other components
                angular.forEach($scope.components, function (otherComponent) {
                    otherComponent.changeLinkedComponentName(formData.name, componentName);
                });

                // Update the name of the jointjs graph element
                var rects = $scope.graph.getElements();
                angular.forEach(rects, function (rect) {
                    if (rect.get('name') === componentName) {
                        rect.set('name', formData.name);
                    }
                });
            }

            $scope.components[formData.name] = formData.values;
        });
    }

    $scope.handleDrop = function (component, board, event) {

        var droppableDocumentOffset = $(board).find( "svg" ).offset(),
            X = (event.x || event.clientX) - droppableDocumentOffset.left - 50 + $window.pageXOffset,
            Y = (event.y || event.clientY) - droppableDocumentOffset.top - 15 + $window.pageYOffset,
            type = component.attributes['data-type'].value,
            name = selectedComponents.getElementName(type),
            componentInstance = allComponents[type],
            isBinary = component.attributes['data-binary'].value === 'true',
            node;



        node = new element.createElement({
            position: { x: X, y: Y },
            size: { width: 216, height: 90 },
            name: name,
            logo: component.attributes['data-logo'].value,
            binary: isBinary,
            options: {interactive: true}
        });



        $scope.graph.addCell(node);
        node.on('createLink', createLink);
        node.on('removeLink', removeLink);
        node.on('onOpenDetail', onOpenDetail);
        node.on('onRemove', onRemove);

        $scope.components[name] = angular.copy(componentInstance);
        $scope.components[name].name = name;

        $scope.$apply();
    };
});
