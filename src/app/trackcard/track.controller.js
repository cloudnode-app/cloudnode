'use strict';

/**
* cloudnode.trackcard Module
*
* Description
*/
angular.module('cloudnode.directive.trackcard', [
  'cloudnode.service.likes'
])

.controller('TrackCtrl', function ($scope, $rootScope, LikesService) {
  $scope.isLiked = false;
  $scope.likedConfig = {
    true: {
      color: '#EF6C00',
      tooltip: 'Unlike track'
    },
    false: {
      color: '#fff',
      tooltip: 'Like track'
    }
  };

  $scope.isPlaying = false;
  $scope.fabIcon = {
    true: 'pause',
    false: 'play_arrow'
  };


  $scope.initTrack = function initTrack() {
    $scope.track.uuid = $scope.uuid;
    if (LikesService.isInitialized()) {
      setIfTrackLiked();
    } else {
      LikesService.onInitialized(setIfTrackLiked);
    }
  };

  $scope.togglePlayTrack = function playTrack() {
    if ($scope.isPlaying){
      $rootScope.$broadcast('player.pause.track', $scope.track.id);
    } else {
      $rootScope.$broadcast('queue.check', {context: $scope.context, item: $scope.track});
      $rootScope.$broadcast('player.play.track', $scope.track);
    }
  };

  $rootScope.$on('track.setPlaying', function (event, id){
    if ($scope.track.id === id)
      $scope.isPlaying = true;
  });

  $rootScope.$on('track.setPause', function (event, id){
    if ($scope.track.id === id)
      $scope.isPlaying = false;
  });

  $scope.toggleTrackLiked = function toggleTrackLiked() {
    if ($scope.isLiked) {
      LikesService.unlikeTrack($scope.track.id).then(function(){
        $scope.isLiked = false;
      }, function(){

      });
    } else {
      LikesService.likeTrack($scope.track).then(function(){
        $scope.isLiked = true;
      }, function(){

      });
    }
  };

  function setIfTrackLiked() {
    if (LikesService.isLiked($scope.track.id)) {
      $scope.isLiked = true;
    }
  }

});
