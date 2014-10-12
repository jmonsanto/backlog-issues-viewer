'use strict';

angular.module('PopupApp')
  .controller('PopupCtrl', ['$scope', '$interval', function ($scope, $interval) {
    var self = this;

    $scope.issues = [];

    $scope.openOptionPage = function () {
      chrome.tabs.create({url: 'options.html'});
    }

    self.reload = function () {
      $scope.issues = JSON.parse(localStorage.getItem('issues')) || [];
    };

    $scope.join = function (list, propertyName) {
      return _.pluck(list, propertyName).join();
    }

    self.reload();

    $interval(self.reload, Globals.interval);
  }]);
