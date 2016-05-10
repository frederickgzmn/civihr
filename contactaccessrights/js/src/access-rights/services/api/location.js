define([
  'access-rights/modules/models',
  'common/services/api'
], function (models) {
  'use strict';

  models.factory('locationApi', ['api', function (api) {
    return api.extend({
      query: function () {
        return this.sendGET('OptionValue', 'get', {
          'option_group_name': 'hrjc_location'
        }, true);
      }
    });
  }]);
});
