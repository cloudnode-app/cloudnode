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

return {

  /**
   * Get the playlist info of the logged in user
   * @return {object} The user or an error
   */
  getMePlaylists: function getMePlaylists() {
    return ApiService.getMePlaylists();
  }
};
});
