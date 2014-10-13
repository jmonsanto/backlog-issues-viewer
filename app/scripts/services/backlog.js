'use strict';

angular.module('Services', [])
  .service('Backlog', [function () {
    var self = this;

    /**
     * @param {object} auth
     * @returns {object}
     */
    self.getProjects = function (auth) {
      return call(auth, 'projects');
    };

    /**
     * @param auth
     * @returns {object}
     */
    self.getMySelf = function (auth) {
      return call(auth, 'users/myself');
    };

    /**
     * @param {object} auth
     * @param {string} method
     * @param {object} options
     * @returns {object}
     */
    var call = function (auth, method, options) {
      var url = getEndPoint(auth.spaceKey) + method;

      options = options || {};

      options.apiKey = auth.apiKey;

      return jQuery.get(url, options);
    };

    /**
     * @param {string} spaceKey
     * @returns {string}
     */
    var getEndPoint = function (spaceKey) {
      return _.str.sprintf('https://%s.backlog.jp/api/v2/', spaceKey);
    };
  }]);
