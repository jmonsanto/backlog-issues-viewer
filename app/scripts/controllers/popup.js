'use strict';

angular.module('PopupApp')
  .controller('PopupCtrl', ['$scope', '$interval', function ($scope, $interval) {
    var self = this;

    // Backlog issues
    $scope.issues = [];

    /**
     * open chrome extension options page
     */
    $scope.openOptionsPage = function () {
      chrome.tabs.create({url: 'options.html'});
    };

    /**
     * update Backlog issues
     */
    self.updateIssues = function () {
      $scope.issues = JSON.parse(localStorage.getItem('issues')) || [];
    };

    /**
     * @param {array} list
     * @param {string} propertyName
     * @returns {string}
     */
    $scope.join = function (list, propertyName) {
      return _.pluck(list, propertyName).join();
    };

    // initialize
    (function () {
      self.updateIssues();
      $interval(self.updateIssues, Globals.interval);
    })();

  }]);
