'use strict';

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
    getPlaylists();
  };

  /**
   * Set all the users playlists from
   * the PlaylistService.
   * @return {void}
   */
  function getPlaylists() {
    PlaylistService.getMePlaylists().then(function (playlists) {
      $scope.playlists = playlists;
    }, function () {

    });
  }

});
