'use strict';


angular
  .module('qradarApp')
  .service('yamlParser', function () {


    /**
     * Remove empty objects recursively from another object
     *
     * @param {Object} object
     * @returns {Object}
     */
    function cleanEmptyObjects(object) {
        if (_.isEmpty(object)) {
            return '';
        }

        for (var prop in object) {
            if (!object.hasOwnProperty(prop) || typeof object[prop] !== 'object') {
                continue;
            }

            if (prop === 'common' || prop === 'binary') {
                delete object[prop];
                continue;
            }

            object[prop] = cleanEmptyObjects(object[prop]);
            if (_.isEmpty(object[prop])) {
                delete object[prop];
            }
        }

        return object;
    }

    function cleanResult(object) {
        for (var prop in object) {
            if (!object.hasOwnProperty(prop)) {
                continue;
            }

            // Remove binary field & empty string
            if (prop === 'binary' || object[prop] === '') {
                delete object[prop];
                continue;
            }

            if(typeof object[prop] === 'object') {
                object[prop] = cleanResult(object[prop]);
            }
        }

        return object;
    }

    /**
     * Dump an Object to a YAML string
     *
     * @param {Object} object
     * @param {Number} depth
     * @returns {String}
     */
    function dump(object, depth) {
        if (_.isEmpty(object)) {
            return '';
        }

        return YAML.stringify(object, depth);
    }

    return {
        cleanEmptyObjects: cleanEmptyObjects,
        cleanResult: cleanResult,
        dump: dump
    };
});
