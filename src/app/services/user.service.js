'use strict';

/**
* cloudnode.service.user Module
*
* The CloudNode SoundCloud User service
*/
angular.module('cloudnode.service.user', [
  'cloudnode.service.api'
])

.factory('UserService', function (ApiService) {

return {

  getUser: function getUser(userId) {
    return ApiService.getUser(userId);
  },

  getUserVisual: function getUserVisual(userId) {
    return ApiService.getUserVisual(userId);
  },

  getUserSpotlight: function getUserSpotlight(userId) {
    return ApiService.getUserSpotlight(userId);
  },

  getUserActivity: function getUserActivity(userId) {
    return ApiService.getUserActivity(userId);
  },

  getUserTracks: function getUserTracks(userId) {
    return ApiService.getUserTracks(userId);
  },

  getUserReposts: function getUserReposts(userId) {
    return ApiService.getUserReposts(userId);
  },

  getUserPlaylists: function getUserPlaylists(userId) {
    return ApiService.getUserPlaylists(userId);
  }

};
});
