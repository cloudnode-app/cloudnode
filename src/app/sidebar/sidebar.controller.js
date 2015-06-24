'use strict';

/**
* cloudnode.sidebar Module
*
* Description
*/
angular.module('cloudnode.sidebar', [
  'cloudnode.service.playlists'
])

.controller('SidebarCtrl', function($scope, PlaylistService){

  $scope.playlists = [];

  $scope.initSidebar = function initSidebar() {
    PlaylistService.getMePlaylists().then(function (playlists) {
      $scope.playlists = playlists;
    }, function () {

    });
  };

});
