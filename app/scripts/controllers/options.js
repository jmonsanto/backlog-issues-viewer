'use strict';

angular.module('OptionsApp')
  .controller('OptionsCtrl', ['$scope', 'Backlog', '$timeout', function ($scope, Backlog, $timeout) {
    var self = this;

    // values for authentication
    $scope.auth = angular.copy(Globals.auth);

    // authentication user's Backlog data
    $scope.myself = {};

    // multiple accounts
    $scope.accounts = [];

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
        var account = _.findWhere($scope.accounts, {id: response.id}) ||
          {id: response.id, auth: angular.copy($scope.auth), myself: angular.copy(response)};

        // remove duplicate account and unshift
        $scope.accounts = _.without($scope.accounts, account);
        $scope.accounts.unshift(account);

        chrome.storage.sync.set({auth: $scope.auth, myself: response, accounts: $scope.accounts}, self.sync);
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
     * @param {number} id
     */
    $scope.changeAccount = function (id) {
      var account = _.findWhere($scope.accounts, {id: id});
      $scope.auth = angular.copy(account.auth);
      $scope.saveAuth();
    };

    /**
     * @param {number} id
     */
    $scope.removeAccount = function (id) {
      var account = _.findWhere($scope.accounts, {id: id});
      $scope.accounts = _.without($scope.accounts, account);

      chrome.storage.sync.set({accounts: $scope.accounts}, self.sync);
    };

    /**
     * sync with chrome storage
     */
    self.sync = function () {
      var params = {auth: Globals.auth, projects: [], conditions: Globals.conditions, myself: {}, accounts: []};

      chrome.storage.sync.get(params, function (items) {
        $scope.$apply(function () {
          $scope.auth = items.auth;
          $scope.conditions = items.conditions;
          $scope.projects = items.projects;
          $scope.myself = items.myself;
          $scope.accounts = items.accounts;
        });
      });

      Globals.getIssues();
    };

    // initialize
    (function () {
      self.sync();
    })();

  }]);
