'use strict';

/**
* cloudnode.service.api Module
*
* The CloudNode SoundCloud API service
*/
angular.module('cloudnode.service.playlists', [
  'cloudnode.service.api'
])

.factory('PlaylistService', function (ApiService) {
  var initialized   = false;
  var initBusy      = false;
  var initObservers = [];

  var playlists = {};

  function notifyObservers() {
    for (var i = initObservers.length - 1; i >= 0; i--) {
      initObservers[i]();
    }
    initObservers = [];
  }

  function init() {
    if (!initBusy) {
      ApiService.getMePlaylists().then(function (playlistsObj) {
        playlists = playlistsObj;
        notifyObservers();
      }, function () {

      });
    }
  }

return {

  isInitialized: function isInitialized() {
    if (!initialized) {
      init();
      initBusy = true;
    }
    return initialized;
  },

  onInitialized: function initObserver(observer) {
    initObservers.push(observer);
  },

  updatePlaylists: function updatePlaylists() {
    return ApiService.getMePlaylists().then(function (playlists) {
      playlists = playlists;
      return playlists;
    }, function () {

    });
  },

  /**
   * Get the playlist info of the logged in user
   * @return {object} The user or an error
   */
  getMePlaylists: function getMePlaylists() {
    return playlists;
  },

  addToPlaylist: function addToPlaylist(playlistId, track) {
    var tracks = {};
    for (var i = playlists.length - 1; i >= 0; i--) {
      if (playlists[i].id === playlistId) {
        playlists[i].tracks.push(track);
        tracks = playlists[i].tracks;
      }
    }

    return ApiService.addToPlaylist(playlistId, tracks).then(function (){
      return true;
    }, function (){
      return false;
    });
  }
};
});
