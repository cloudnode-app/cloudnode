'use strict';
var ipc = require('ipc');

/**
* cloudnode.service.api Module
*
* The CloudNode SoundCloud API service
*/
angular.module('cloudnode.service.api', [
  'cloudnode.api.endpoints'
])

.factory('ApiService', function ($http, $q, END_POINTS) {
//init params
var isInitialized      = false;

var authToken = null;
var clientId  = '3b1212cb2db7e347cdd1ac67d428ef45';

function addParameter(url, param, value) {
    // Using a positive lookahead (?=\=) to find the
    // given parameter, preceded by a ? or &, and followed
    // by a = with a value after than (using a non-greedy selector)
    // and then followed by a & or the end of the string
    var val = new RegExp('(\\?|\\&)' + param + '=.*?(?=(&|$))');
    var parts = url.toString().split('#');
    var base_url = parts[0];
    var hash = parts[1];
    var qstring = /\?.+$/;
    var newURL = url;

    // Check if the parameter exists
    if (val.test(base_url))
    {
        // if it does, replace it, using the captured group
        // to determine & or ? at the beginning
        newURL = base_url.replace(val, '$1' + param + '=' + value);
    }
    else if (qstring.test(base_url))
    {
        // otherwise, if there is a query string at all
        // add the param to the end of it
        newURL = base_url + '&' + param + '=' + value;
    }
    else
    {
        // if there's no query string, add one
        newURL = base_url + '?' + param + '=' + value;
    }

    if (hash)
    {
        newURL += '#' + hash;
    }

    return newURL;
}

function tokenifyURL(endpoint) {
  return addParameter(endpoint, 'oauth_token', authToken);
}

function initialize(initObserver) {
  ipc.send('apiInit', 'getAuthToken');

  ipc.on('apiInit', function(token){
    authToken     = token;
    isInitialized = true;
    initObserver();
  });
}

return {
  init: function initApiService(initObserver) {
    if (isInitialized) {
      initObserver();
    } else {
      initialize(initObserver);
    }
  },

  getStreamableUrl: function getStreamableUrl(track) {
    var url = '';
    if (track.hasOwnProperty('uri')) {
        url = track.uri;
    } else {
        url = track.stream_url;
    }

    var suffix = '/stream';
    if (url.indexOf(suffix, url.length - suffix.length) === -1) {
        url = url + '/stream';
    }
    return addParameter(url, 'client_id', clientId);
  },

  /**
   * Get the user info of the logged in user
   * @return {object} The user or an error
   */
  getMe: function getMe() {
    return $http.get(tokenifyURL(END_POINTS.me)).then(function (response){
      if (angular.isObject(response)) {
        return response.data;
      } else {
        return $q.reject({error: 'InvalidResponse'});
      }
    }, function () {
      return $q.reject({error: 'UnexpectedResponse'});
    });
  },

  /**
   * Get the playlists for the currently logged in user
   * @return {object} The playlists, or a reject
   */
  getMePlaylists: function getMePlaylists() {
    return $http.get(tokenifyURL(END_POINTS.mePlaylists)).then(function (response) {
      if (angular.isObject(response)) {
        return response.data;
      } else {
        return $q.reject({error: 'InvalidResponse'});
      }
    }, function () {
      return $q.reject({error: 'UnexpectedResponse'});
    });
  },

  getStream: function getStream() {
    return $http.get(tokenifyURL(END_POINTS.meStream)).then(function (response) {
      if (angular.isObject(response)) {
        return response.data;
      } else {
        return $q.reject({error: 'InvalidResponse'});
      }
    }, function () {
      return $q.reject({error: 'UnexpectedResponse'});
    });
  },

  getStreamNextPage: function getStreamNextPage(href) {
    return $http.get(tokenifyURL(href)).then(function (response) {
      if (angular.isObject(response)) {
        return response.data;
      } else {
        return $q.reject({error: 'InvalidResponse'});
      }
    }, function () {
      return $q.reject({error: 'UnexpectedResponse'});
    });
  },

  getMeLikes: function getMeLikes() {
    return $http.get(tokenifyURL(END_POINTS.meFavorites)).then(function (response) {
      if (angular.isObject(response)) {
        return response.data;
      } else {
        return $q.reject({error: 'InvalidResponse'});
      }
    }, function () {
      return $q.reject({error: 'UnexpectedResponse'});
    });
  },

  getMeLikesIds: function getMeLikesIds() {
    return $http.get(tokenifyURL(END_POINTS.meFavoritesIds)).then(function (response) {
      if (angular.isObject(response)) {
        return response.data;
      } else {
        return $q.reject({error: 'InvalidResponse'});
      }
    }, function () {
      return $q.reject({error: 'UnexpectedResponse'});
    });
  },

  likeTrack: function likeTrack(trackId) {
    var url = END_POINTS.meFavoriteTrack.replace('%s', trackId);
    return $http.put(tokenifyURL(url)).then(function () {
      return true;
    }, function (){
      return false;
    });
  },

  unlikeTrack: function unlikeTrack(trackId) {
    var url = END_POINTS.meFavoriteTrack.replace('%s', trackId);
    return $http.delete(tokenifyURL(url)).then(function () {
      return true;
    }, function (){
      return false;
    });
  },

  getMeRepostIds: function getMeRepostIds() {
    return $http.get(tokenifyURL(END_POINTS.meRepostIds)).then(function (response) {
      if (angular.isObject(response)) {
        return response.data;
      } else {
        return $q.reject({error: 'InvalidResponse'});
      }
    }, function () {
      return $q.reject({error: 'UnexpectedResponse'});
    });
  },

  getAllRepostObjs: function getMeRepostObjs() {
    return $http.get(tokenifyURL(END_POINTS.meReposts)).then(function (response) {
      if (angular.isObject(response)) {
        return response.data;
      } else {
        return $q.reject({error: 'InvalidResponse'});
      }
    }, function () {
      return $q.reject({error: 'UnexpectedResponse'});
    });
  },

  repostItem: function repostItem(itemId) {
    var url = END_POINTS.meRepost.replace('%s', itemId);
    return $http.put(tokenifyURL(url)).then(function () {
      return true;
    }, function () {
      return false;
    });
  },

  unRepostItem: function unRepostItem(itemId) {
    var url = END_POINTS.meRepost.replace('%s', itemId);
    return $http.delete(tokenifyURL(url)).then(function () {
      return true;
    }, function () {
      return false;
    });
  },

  getUser: function getUser(userId) {
    var url = END_POINTS.user.replace('%s', userId);
    return $http.get(tokenifyURL(url)).then(function (response) {
      if (angular.isObject(response)) {
        return response.data;
      } else {
        return $q.reject({error: 'InvalidResponse'});
      }
    }, function () {
      return $q.reject({error: 'UnexpectedResponse'});
    });
  },

  getUserVisual: function getUserVisual(userId) {
    var url = END_POINTS.userVisual.replace('%s', userId);
    return $http.get(tokenifyURL(url)).then(function (response) {
      if (angular.isObject(response)) {
        return response.data;
      } else {
        return $q.reject({error: 'InvalidResponse'});
      }
    }, function () {
      return $q.reject({error: 'UnexpectedResponse'});
    });
  },

  getUserActivity: function getUserActivity(userId) {
    var url = END_POINTS.userActivity.replace('%s', userId);
    return $http.get(tokenifyURL(url)).then(function (response) {
      if (angular.isObject(response)) {
        return response.data;
      } else {
        return $q.reject({error: 'InvalidResponse'});
      }
    }, function () {
      return $q.reject({error: 'UnexpectedResponse'});
    });
  },

  getUserSpotlight: function getUserSpotlight(userId) {
    var url = END_POINTS.userSpotlight.replace('%s', userId);
    return $http.get(tokenifyURL(url)).then(function (response) {
      if (angular.isObject(response)) {
        return response.data;
      } else {
        return $q.reject({error: 'InvalidResponse'});
      }
    }, function () {
      return $q.reject({error: 'UnexpectedResponse'});
    });
  },

  getUserTracks: function getUserTracks(userId) {
    var url = END_POINTS.userTracks.replace('%s', userId);
    return $http.get(tokenifyURL(url)).then(function (response) {
      if (angular.isObject(response)) {
        return response.data;
      } else {
        return $q.reject({error: 'InvalidResponse'});
      }
    }, function () {
      return $q.reject({error: 'UnexpectedResponse'});
    });
  },

  getUserReposts: function getUserReposts(userId) {
    var url = END_POINTS.user.replace('%s', userId);
    return $http.get(tokenifyURL(url)).then(function (response) {
      if (angular.isObject(response)) {
        return response.data;
      } else {
        return $q.reject({error: 'InvalidResponse'});
      }
    }, function () {
      return $q.reject({error: 'UnexpectedResponse'});
    });
  },

  getUserPlaylists: function getUserPlaylists(userId) {
    var url = END_POINTS.userPlaylists.replace('%s', userId);
    return $http.get(tokenifyURL(url)).then(function (response) {
      if (angular.isObject(response)) {
        return response.data;
      } else {
        return $q.reject({error: 'InvalidResponse'});
      }
    }, function () {
      return $q.reject({error: 'UnexpectedResponse'});
    });
  },

  addToPlaylist: function addToPlaylist(playlistId, playlistData) {
    var url = END_POINTS.playlist.replace('%s', playlistId);
    return $http.put(tokenifyURL(url), playlistData).then(function (response) {
      if (angular.isObject(response)) {
        return response.data;
      } else {
        return $q.reject({error: 'InvalidResponse'});
      }
    }, function () {
      return $q.reject({error: 'UnexpectedResponse'});
    });
  }
};
});
