(function () {
    'use strict';

    angular
        .module('qradarApp')
        .directive('jointDiagram', jointDiagram);


    /* @ngInject */
    function jointDiagram($window) {
      var directive = {
        link: link,
        restrict: 'E',
        scope: {
          height: '=',
          width: '=',
          gridSize: '=',
          graph: '=',
          drop: '='
        }
      };

      return directive;

      function link(scope, element, attrs) {

        var diagram = newDiagram(scope.height, scope.width, scope.gridSize, scope.graph , element[0]);

        //add event handlers to interact with the diagram
        diagram.on('cell:pointerclick', function (cellView, evt, x, y) {

          //your logic here e.g. select the element

        });

        diagram.on('blank:pointerclick', function (evt, x, y) {

          // your logic here e.g. unselect the element by clicking on a blank part of the diagram
        });

        diagram.on('link:options', function (evt, cellView, x, y) {

          // your logic here: e.g. select a link by its options tool
        });

        var el = element[0];

        el.addEventListener('dragover', function (e) {
          e.dataTransfer.dropEffect = 'move';

          if (e.preventDefault) {
            e.preventDefault();
          }

          return false;
        }, false);

        el.addEventListener('drop', function (e) {
          // Stops some browsers from redirecting.
          if (e.stopPropagation) {
            e.stopPropagation();
          }

          var elementDropped = document.getElementById(e.dataTransfer.getData('id')),
            dropMethod = scope.drop;

          // call the drop passed drop function
          if (typeof dropMethod === 'function') {
            scope.drop(elementDropped, element[0], e);
          }

          return false;
        }, false);
      }

      function newDiagram(height, width, gridSize,graph, targetElement) {

        var paper = new joint.dia.Paper({
          el: targetElement,
          width: width+'%',
          height: height+'%',
          gridSize: gridSize,
          model: graph,
        });

        return paper;
      }
    }
})();
