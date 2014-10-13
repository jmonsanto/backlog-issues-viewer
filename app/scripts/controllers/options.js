'use strict';

angular.module('OptionsApp')
  .controller('OptionsCtrl', ['$scope', 'Backlog', '$timeout', function ($scope, Backlog, $timeout) {
    var self = this;

    // values for authentication
    $scope.auth = angular.copy(Globals.auth);

    // authentication user's Backlog data
    $scope.myself = {};

    // Backlog projects
    $scope.projects = [];

    // values for conditions
    $scope.conditions = angular.copy(Globals.conditions);

    // messages for options page
    $scope.messages = {};

    /**
     * save values for authentication to chrome storage
     */
    $scope.saveAuth = function () {
      Backlog.getMySelf($scope.auth).then(function (response) {
        chrome.storage.sync.set({auth: $scope.auth, myself: response}, self.sync);
        $scope.getProjects();

        $scope.messages.saveAuth = 'Saved!!';
        $timeout(function () { $scope.messages.saveAuth = ''; }, 3000);
      }).fail(function () {
        $scope.$apply(function () {
          $scope.messages.saveAuth = 'Error!! Invalid Space or API Key.';
          $timeout(function () { $scope.messages.saveAuth = ''; }, 3000);
        });
      });
    };

    /**
     * save values for conditions to chrome storage
     */
    $scope.saveConditions = function () {
      chrome.storage.sync.set({conditions: $scope.conditions}, self.sync);

      $scope.messages.saveConditions = 'Saved!!';
      $timeout(function () { $scope.messages.saveConditions = ''; }, 3000);
    };

    /**
     * get Backlog projects
     */
    $scope.getProjects = function () {
      Backlog.getProjects($scope.auth).then(function (response) {
        chrome.storage.sync.set({projects: response}, self.sync);
      });
    };

    /**
     * @param {number} projectId
     */
    $scope.toggleProjects = function (projectId) {
      var idx = $scope.conditions.projectIds.indexOf(projectId);

      if (idx > -1) {
        $scope.conditions.projectIds.splice(idx, 1);
      } else {
        $scope.conditions.projectIds.push(projectId);
      }
    };

    /**
     * sync with chrome storage
     */
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

    // initialize
    (function () {
      self.sync();
    })();

  }]);
