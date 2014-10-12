'use strict';

angular.module('OptionsApp')
  .controller('OptionsCtrl', ['$scope', 'Backlog', '$timeout', function ($scope, Backlog, $timeout) {
    var self = this;

    $scope.auth = angular.copy(Globals.auth);

    $scope.myself = {};

    $scope.projects = [];

    $scope.conditions = angular.copy(Globals.conditions);

    $scope.message = {};

    $scope.saveAuth = function () {
      Backlog.getMySelf($scope.auth).then(function (response) {
        chrome.storage.sync.set({auth: $scope.auth, myself: response}, self.sync);
        $scope.getProjects();

        $scope.message.saveAuth = 'Saved!!';
        $timeout(function () { $scope.message.saveAuth = '' }, 3000);
      }).fail(function () {
        $scope.$apply(function () {
          $scope.message.saveAuth = 'Error!! Invalid Space or API Key.';
          $timeout(function () { $scope.message.saveAuth = '' }, 3000);
        });
      });
    };

    $scope.saveConditions = function () {
      chrome.storage.sync.set({conditions: $scope.conditions}, self.sync);

      $scope.message.saveConditions = 'Saved!!';
      $timeout(function () { $scope.message.saveConditions = '' }, 3000);
    };

    $scope.getProjects = function () {
      Backlog.getProjects($scope.auth).then(function (response) {
        chrome.storage.sync.set({projects: response}, self.sync);
      });
    }

    $scope.toggleProjects = function (projectId) {
      var idx = $scope.conditions.projectIds.indexOf(projectId);

      if (idx > -1) {
        $scope.conditions.projectIds.splice(idx, 1);
      } else {
        $scope.conditions.projectIds.push(projectId);
      }
    };

    self.sync = function () {
      var params = {auth: Globals.auth, projects: [], conditions: Globals.conditions, myself: {}};

      chrome.storage.sync.get(params, function (items) {
        $scope.$apply(function () {
          $scope.auth = items.auth;
          $scope.conditions = items.conditions;
          $scope.projects = items.projects;
          $scope.myself = items.myself;
        });
      });

      Globals.getIssues();
    };

    (function () {
      self.sync();
    })();

  }]);
