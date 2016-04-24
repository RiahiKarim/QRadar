(function () {
    'use strict';

    angular
        .module('qradarApp')
        .factory('jointRessource', jointRessource);

    /* @ngInject */
    function jointRessource(element) {

        var service = {
          NewElement: function(configObject) {
            return createElement(element,configObject);
          }
        };
        return service;

        ////////////////

      function wrapModel(JointModel) {
        var ModelConstructor = JointModel.getConstructor();

        //We need a wrapper model around the original constructor since we are going to conditionally
        //prototype methods on it that shouldn't be available on all model instances.
        function Model(params) {
          ModelConstructor.call(this, params);
        }

        Model.prototype = Object.create(ModelConstructor.prototype);
        Model.prototype.constructor = ModelConstructor;
        return Model;
      }

      function Factory(Model) {
        return {
          create: function(params) {
            return new Model(params);
          }
        };
      }
        function createElement(element,configObject) {
          var Model = wrapModel(element);
          console.log(new Factory(Model));
        }
    }
})();
