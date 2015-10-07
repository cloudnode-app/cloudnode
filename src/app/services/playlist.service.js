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
        playlists = setArtwork(playlistsObj);
        initialized = true;
        notifyObservers();
      }, function () {

      });
    }
  }

  function setArtwork(playlists) {
    for (var i = playlists.length - 1; i >= 0; i--) {
      console.log(playlists[i]);
        if (playlists[i].artwork_url === null) {
        for (var j = 0;  i < playlists[i].track_count; i++){
          if (playlists[i].tracks[j].artwork_url !== null) {
            playlists[i].artwork_url = playlists[i].tracks[j].artwork_url;
            break;
          }
        }
      }
    }
    return playlists;
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
      playlists = setArtwork(playlists);
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
    var tracks = [];
    for (var i = playlists.length - 1; i >= 0; i--) {
      if (playlists[i].id === playlistId) {
        tracks = playlists[i].tracks;
        tracks.push({id: track.id});
      }
    }
    var playlist = {
      'playlist': {
        'tracks': tracks
      }
    };

    var _this = this;
    return ApiService.addToPlaylist(playlistId, playlist).then(function (){
      _this.updatePlaylists();
      return true;
    }, function (){
      return false;
    });
  }
};
});
