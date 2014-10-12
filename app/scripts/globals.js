'use strict';

var Globals = {
  auth: {
    spaceKey: '',
    apiKey: ''
  },
  conditions: {
    projectIds: [],
    onlyMyIssues: 1,
    withClosed: 0,
    showDaysForClosed: 3
  },
  interval: 60000,
  getIssues: function () {
    var params = {auth: Globals.auth, conditions: Globals.conditions, myself: {}, projects: []};

    chrome.storage.sync.get(params, function (items) {
      if (items.myself.id) {
        var url = _.str.sprintf('https://%s.backlog.jp/api/v2/%s', items.auth.spaceKey, 'issues');

        if (! items.conditions.projectIds.length) {
          return;
        }

        var options = {
          'projectId[]': items.conditions.projectIds,
          'assigneeId[]': items.conditions.onlyMyIssues ? [items.myself.id] : [],
          'statusId[]': items.conditions.withClosed ? [] : [1, 2, 3], // "4" is Closed
          count: 100,
          apiKey: items.auth.apiKey
        };

        jQuery.get(url, options, function (response) {
          var issues = [];
          jQuery.each(response, function (index, issue) {
            issue._project = _.findWhere(items.projects, {id: issue.projectId});
            issue._permalink = _.str.sprintf('https://%s.backlog.jp/view/%s', items.auth.spaceKey, issue.issueKey);

            if (issue.status.id === 4) {
              var now = moment().format('X');
              var period = moment(issue.updated).add(items.conditions.showDaysForClosed, 'day').format('X');
              if (now <= period) {
                issue._over = false;
                issues.push(issue);
              }
            } else {
              issue._over = moment(issue.limitDate).format('X') < moment().format('X');
              issues.push(issue);
            }
          });

          issues = _.sortBy(issues, function (issue) { return moment(issue.limitDate).format('X'); });
          issues = _.sortBy(issues, function (issue) { return issue.status.id === 4 ? 0 : -1; });

          localStorage.setItem('issues', JSON.stringify(issues));

          var badgeText = issues.length ? String(issues.length) : '';
          chrome.browserAction.setBadgeText({text: badgeText});
        });
      }
    });
  }
};
