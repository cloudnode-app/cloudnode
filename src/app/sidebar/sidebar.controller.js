'use strict';
var ipc = require('ipc');

/**
* cloudnode.sidebar Module
*
* The sidebar controller
*/
angular.module('cloudnode.sidebar', [
  'cloudnode.service.playlists'
])

.controller('SidebarCtrl', function($scope, PlaylistService){

  $scope.playlists = [];

  /**
   * Init the sidebar
   * Get all the playlists of the user
   * @return {void}
   */
  $scope.initSidebar = function initSidebar() {

    if (PlaylistService.isInitialized()) {
      getPlaylists();
    } else {
      PlaylistService.onInitialized(getPlaylists);
    }
  };

  /**
   * Set all the users playlists from
   * the PlaylistService.
   * @return {void}
   */
  function getPlaylists() {
    $scope.playlists = PlaylistService.getMePlaylists();
  }

  $scope.logOut = function logOut() {
    ipc.send('user.logout');
  };

});
