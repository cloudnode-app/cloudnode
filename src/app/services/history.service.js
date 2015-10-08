'use strict';

angular.module('cloudnode.service.history', [
])

.factory('HistoryService', function ($rootScope) {
  var history         = [];
  var historyObserver = {};

  $rootScope.$on('history.add', function (event, track){
    History.addTrack(track);
  });

  function notifyObserver(track) {
    if (angular.isFunction(historyObserver)) {
      historyObserver(track);
    }
  }

  var History = {
    addTrack: function addHistoryItem(track) {
      var index = history.indexOf(track);
      if (index !== -1) {
        delete history[index];
      }
      history.push(track);
      notifyObserver(track);
    },

    getHistory: function getHistory() {
      return history;
    },

    onHistoryUpdate: function onHistoryUpdate(observer) {
      if (angular.isFunction(observer)) {
        historyObserver = observer;
      }
    }
  };

  return History;
});
