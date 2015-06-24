'use strict';

/**
* cloudnode.directe.player Module
*
* Description
*/
angular.module('cloudnode.directive.player', [
  'angularSoundManager',
  'cloudnode.service.api'
])

.controller('PlayerCtrl', function ($rootScope, $scope, angularPlayer) {
  /**
   * Default track settings
   */
  $scope.currentPosition = '0:00';
  $scope.currentDuration = '0:00';
  $scope.currentPlaying = {
    artist: '',
    title: '',
    id: 0
  };
  $scope.currentProgress = 0;

  /**
   * Player controls
   */
  $scope.isMuted = false;
  $scope.volumeIcon = 'volume_up';
  $scope.volume = 100;

  $scope.isPlaying = false;
  $scope.playerIcon = 'play_circle_outline';

  $scope.songs = [
    {
      id: 12,
      artist: 'The Him',
      title: 'Blondee - I Love You (Original Mix) #1 Beatport Pop/Rock',
      url: 'https://api.soundcloud.com/tracks/198542838/stream?client_id=3b1212cb2db7e347cdd1ac67d428ef45'
    }
  ];
  angularPlayer.addTrack($scope.songs[0]);

  $scope.toggleMuted = function () {
    if ($scope.isMuted) {
      $scope.isMuted = false;
      $scope.volumeIcon = 'volume_up';
      $scope.volume = 100;
    } else {
      $scope.isMuted = true;
      $scope.volumeIcon = 'volume_off';
      $scope.volume = 0;
    }
  };

  $scope.togglePlaying = function() {
    if (angularPlayer.isPlayingStatus()) {
      $scope.playerIcon = 'play_circle_outline';
      angularPlayer.pause();
    } else {
      playTrack($scope.songs[0]);
      $scope.playerIcon = 'pause_circle_outline';
      angularPlayer.initPlayTrack(12, true);
    }
  };

  $scope.$on('track:progress', function (event, data) { /* jshint ignore:line */
    $scope.currentProgress = data;
  });

  $rootScope.$on('play.track', playTrack);

  function playTrack(track) {
    console.log(track);
  }
});
