'use strict';

angular.module('Services', [])
  .service('Backlog', [function () {
    var self = this;

    self.getProjects = function (auth) {
      return call(auth, 'projects');
    };

    self.getMySelf = function (auth) {
      return call(auth, 'users/myself');
    };

    var call = function (auth, method, options) {
      var url = getEndPoint(auth.spaceKey) + method;

      options = options || {};

      options.apiKey = auth.apiKey;

      return jQuery.get(url, options);
    };

    var getEndPoint = function (spaceKey) {
      return _.str.sprintf('https://%s.backlog.jp/api/v2/', spaceKey);
    };
  }]);
