'use strict';

angular.module('cloudnode.service.history', [
])

.factory('HistoryService', function ($rootScope) {
  var history = [];

  $rootScope.$on('history.add', function (event, track){
    History.addTrack(track);
  });

  var History = {
    addTrack: function addHistoryItem(track) {
      var index = history.indexOf(track);
      if (index !== -1) {
        delete history[index];
      }
      history.push(track);
    },

    getHistory: function getHistory() {
      return history;
    }
  };

  return History;
});
