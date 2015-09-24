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
  // Liked variables
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

  // Playing variables
  $scope.isPlaying = false;
  $scope.fabIcon = {
    true: 'pause',
    false: 'play_arrow'
  };

  /**
   * Set the track uuid for use in the queue
   * Check if the LikesService is initialized
   * @return {[type]} [description]
   */
  $scope.initTrack = function initTrack() {
    $scope.track.uuid = $scope.uuid;
    if (LikesService.isInitialized()) {
      setIfTrackLiked();
    } else {
      LikesService.onInitialized(setIfTrackLiked);
    }
  };

  /**
   * Track controls
   */

  /**
   * Toggle playing the track
   * Broadcast a play or pause which the player
   * will receive and use to play the track
   * @return {void}
   */
  $scope.togglePlayTrack = function playTrack() {
    if ($scope.isPlaying){
      $rootScope.$broadcast('player.pause.track', $scope.track.id);
    } else {
      $rootScope.$broadcast('queue.check', {context: $scope.context, item: $scope.track});
      $rootScope.$broadcast('player.play.track', $scope.track);
    }
  };

  /**
   * Handler for receiving track is playing event.
   * Sets the isPlaying var to true and with that
   * the icon for the fab button
   * @param  {object} event The event object
   * @param  {int}    id    The id of the track that is playing
   * @return {void}
   */
  $rootScope.$on('track.setPlaying', function (event, id){
    console.log($scope.track.id, id);
    if ($scope.track.id === id)
      $scope.isPlaying = true;
  });

  /**
   * Handler for receiving track is pause event.
   * Sets the isPlaying var to false and with that
   * the icon for the fab button
   * @param  {object} event The event object
   * @param  {int}    id    The id of the track that is paused
   * @return {void}
   */
  $rootScope.$on('track.setPause', function (event, id){
    if ($scope.track.id === id)
      $scope.isPlaying = false;
  });

  /**
   * Like functions
   */

  /**
   * Toggle the liking of the track
   * Call the LikesService based on if the track is
   * liked or not
   * @return {void}
   */
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

  /**
   * Check with the LikesService if the
   * track is liked by the user. Set the
   * isLiked variable
   */
  function setIfTrackLiked() {
    if (LikesService.isLiked($scope.track.id)) {
      $scope.isLiked = true;
    }
  }

});
