'use strict';

angular.module('Filters', [])
  .filter('truncate', [function () {
    return function (text, length, end) {
      if (text === void 0) {
        return '';
      }

      if (isNaN(length)) {
        length = 10;
      }

      if (end === void 0) {
        end = '...';
      }

      if (text.length <= length) {
        return text;
      }

      return text.substring(0, length - end.length) + end;
    };
  }]);
