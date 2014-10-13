'use strict';

var Globals = {

  // default values for authentication
  auth: {
    spaceKey: '',
    apiKey: ''
  },

  // default values for conditions
  conditions: {
    projectIds: [],
    onlyMyIssues: 1,
    withClosed: 0,
    showDaysForClosed: 1
  },

  // interval for updating issues
  interval: 60000,

  /**
   *  get issues from Backlog
   *  @see http://developer.nulab-inc.com/ja/docs/backlog/api/2/get-issues
   */
  getIssues: function () {
    var params = {auth: Globals.auth, conditions: Globals.conditions, myself: {}, projects: []};

    chrome.storage.sync.get(params, function (items) {
      // "projectId[]" is required
      if (! items.myself.id || ! items.conditions.projectIds.length) {
        return;
      }

      // get-issues api url
      var url = _.str.sprintf('https://%s.backlog.jp/api/v2/%s', items.auth.spaceKey, 'issues');

      // api parameters
      var options = {
        'projectId[]': items.conditions.projectIds,
        'assigneeId[]': items.conditions.onlyMyIssues ? [items.myself.id] : [],
        'statusId[]': items.conditions.withClosed ? [] : [1, 2, 3], // "4" is Closed
        count: 100,
        apiKey: items.auth.apiKey
      };

      // call api
      jQuery.get(url, options, function (response) {
        var issues = [];
        jQuery.each(response, function (index, issue) {
          // append values for frontend
          issue._project = _.findWhere(items.projects, {id: issue.projectId});
          issue._permalink = _.str.sprintf('https://%s.backlog.jp/view/%s', items.auth.spaceKey, issue.issueKey);

          if (issue.status.id === 4) {
            // issue is closed
            var now = moment().format('X');
            var period = moment(issue.updated).add(items.conditions.showDaysForClosed, 'day').format('X');
            if (now <= period) {
              issue._over = false;
              issues.push(issue);
            }
          } else {
            // issue is not closed
            issue._over = moment(issue.limitDate).format('X') < moment().format('X');
            issues.push(issue);
          }
        });

        // sort by limitDate and status
        issues = _.sortBy(issues, function (issue) { return moment(issue.limitDate).format('X'); });
        issues = _.sortBy(issues, function (issue) { return issue.status.id === 4 ? 0 : -1; });

        // set issues to localStorage for frontend
        localStorage.setItem('issues', JSON.stringify(issues));

        // update badgeText
        var badgeText = issues.length ? String(issues.length) : '';
        chrome.browserAction.setBadgeText({text: badgeText});
      });
    });
  }

};
