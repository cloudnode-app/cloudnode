'use strict';

angular.module('cloudnode.directive.playlist', [
  'cloudnode.service.playlists'
])

.directive('playlistButton', function (PlaylistService, $mdDialog) { /* jshint ignore:line*/
  return {
    restrict: 'E',
    scope: {
      track: '='
    },
    template: '<md-button class="md-icon-button track-icon-btn" aria-label="Add to a playlist" ng-click="showDialog()">' +
              '\t<md-tooltip>' +
              '\t\tAdd to playlist' +
              '\t</md-tooltip>' +
              '\t<ng-md-icon class="menu-icon" icon="playlist_add" size="24" style="fill:#FFF"></ng-md-icon>' +
              '</md-button>',
    controller: function ($scope, $mdDialog, PlaylistService) {

      $scope.showDialog = function showDialog(ev) {

        $mdDialog.show({
          controller: dialogController,
          scope: this,
          templateUrl: 'directives/playlist.directive.tmpl.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true
        });
      };

      $scope.addToPlaylist = function addToPlaylist(playlistId) {
        PlaylistService.addToPlaylist(playlistId, $scope.track).then(
          function (){
          }, function (){
        });
        $mdDialog.hide();
      };

      function dialogController($scope, $mdDialog) {
        $scope.playlists = [];

        $scope.init = function init() {
          if (PlaylistService.isInitialized()) {
            $scope.playlists = PlaylistService.getMePlaylists();
          } else {
            PlaylistService.onInitialized(function() {
              $scope.playlists = PlaylistService.getMePlaylists();
            });
          }
        };



        $scope.cancel = function cancel() {
          $mdDialog.cancel();
        };
      }
    }
  };
});




