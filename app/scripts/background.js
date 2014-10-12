'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

Globals.getIssues();

setInterval(Globals.getIssues, Globals.interval);
