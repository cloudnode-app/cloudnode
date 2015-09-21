'use strict';

angular.module('cloudnode.service.play', [
  'cloudnode.service.queue'
])

.factory('PlayService', function () {

  var currentlyPlaying = null;
  var isPlaying        = false;

  return {

    setCurrentlyPlaying: function setCurrentlyPlayingtrack(playObj) {
      currentlyPlaying = playObj;
    },

    getCurrentlyPlaying: function getCurrentlyPlaying() {
      return currentlyPlaying;
    },

    setIsPlaying: function setIsPlaying(isPlaying) {
      this.isPlaying = isPlaying;
    },

    isPlaying: function getIsPlaying() {
      return isPlaying;
    }
  };
});
