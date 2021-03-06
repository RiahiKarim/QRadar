'use strict';

angular.module('qradarApp').service('componentFactory', function () {

  var Component = function (attributes) {

    var self = this;

    this.custom = {};
    this.links = [];

    // Set default values for common & custom fields
    angular.forEach(attributes.fields, function(field, fieldName) {
      self[fieldName] = self[fieldName] || field.default || '';
    });

    angular.forEach(attributes.customFields, function(customField, customFieldName) {
      self.custom[customFieldName] = customField.default || '';
    });

    // Copy fields values
    for (var name in attributes) {
      if (attributes.hasOwnProperty(name)) {
        this[name] = attributes[name];
      }
    }
  };

  Component.prototype.createLink = function (target) {
    'use strict';

    if (this.links.indexOf(target.name) === -1) {
      this.links.push(target.name);
    }
  };

  Component.prototype.removeLink = function (oldTarget) {
    'use strict';

    var position,
      removed = false;

    if (oldTarget !== undefined && (position = this.links.indexOf(oldTarget.name)) >= 0) {
      this.links.splice(position, 1);
      removed = true;
    }

    return removed;
  };

  /**
   * Parse values like "80: 80, 8080: 8080" to {80: 80}, {8080: 80}
   *
   * @param {String} map
   * @return {Array}
   */
  Component.prototype.parseMapValue = function (map) {
    var results = {},
      rawValues = map.split(','),
      key,
      value,
      mapDetails;

    angular.forEach(rawValues, function (rawValue) {
      if (rawValue === '') {
        return;
      }

      mapDetails = rawValue.split(':');

      key = mapDetails[0].trim();
      value = mapDetails[1].trim();

      if (/^\d+$/.test(value)) {
        value = parseInt(value, 10);
      }

      if (/^\d+$/.test(key)) {
        key = parseInt(key, 10);
      }

      results[key] = value;
    });

    return results;
  };

  Component.prototype.getFormattedValue = function(field, value) {
    // Check if the value is a map
    if (field.multiple === true && typeof value === 'string' && value !== '') {
      value = this.parseMapValue(value);
    }

    // Check if the value is an array
    if (field.array === true && typeof value === 'string' && value !== '') {
      value = value.split(/,\s*/);
    }

    return value;
  };

  Component.prototype.getOutputFields = function() {
    var self = this,
      results = {
        type: this.type,
        links: this.links,
        custom: {}
      };

    angular.forEach(this.fields, function(field, fieldName) {
      results[fieldName] = self.getFormattedValue(field, self[fieldName]);
    });

    angular.forEach(this.customFields, function(customField, customFieldName) {
      results.custom[customFieldName] = self.getFormattedValue(customField, self.custom[customFieldName]);
    });

    return results;
  };

  Component.prototype.changeLinkedComponentName = function (name, oldName) {
    // Call remove link without calling child methods
    var removed = Component.prototype.removeLink.apply(this, [{name: oldName}]);
    if (removed) {
      Component.prototype.createLink.apply(this, [{name: name}]);
    }
  };


  return {
        Component: Component
        //Database: require('models/components/database'),
        //HttpServer: require('models/components/httpServer'),
        //LoadBalancer: require('models/components/loadBalancer')
    };
});
