'use strict';

angular.module('PopupApp')
  .controller('PopupCtrl', ['$scope', '$interval', 'Backlog', function ($scope, $interval, Backlog) {
    var self = this;

    // values for authentication
    $scope.auth = angular.copy(Globals.auth);

    // Backlog issues
    $scope.issues = [];

    // Backlog notifications count
    $scope.notificationsCount = 0;

    // current date
    $scope.currentDate = new Date();

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

      chrome.storage.sync.get({auth: Globals.auth}, function (items) {
        Backlog.getNotifications(items.auth).then(function (response) {
          $scope.$apply(function () {
            $scope.auth = items.auth;
            $scope.notificationsCount = response.count;
          });
        });
      });
    })();

  }]);
