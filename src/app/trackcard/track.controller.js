'use strict';

/**
* cloudnode.trackcard Module
*
* Description
*/
angular.module('cloudnode.directive.trackcard', [
  'cloudnode.service.likes',
  'cloudnode.service.repost',
  'cloudnode.service.queue',
  'cloudnode.directive.playlist',
  'cloudnode.constants'
])

.controller('TrackCtrl', function ($scope, $rootScope, APP, LikesService, RepostService, QueueService) {
  $scope.APP = APP;

  // For mini track card
  $scope.isExpanded = false;

  // Liked variables
  $scope.isLiked = false;
  $scope.isReposted = false;
  $scope.isPlaying = false;

  /**
   * Set the track uuid for use in the queue
   * Check if the LikesService is initialized
   * @return {[type]} [description]
   */
  $scope.initItem = function initTrack() {
    $scope.item.uuid = $scope.uuid;

    if (LikesService.isInitialized()) {
      setIfTrackLiked();
    } else {
      LikesService.onInitialized(setIfTrackLiked);
    }

    if (RepostService.isInitialized()) {
      setIfTrackReposted();
    } else {
      RepostService.onInitialized(setIfTrackReposted);
    }
  };

  /**
   * Track controls
   */

  function pauseTrack() {
    $rootScope.$broadcast('player.pause.track', $scope.item.id);
  }

  function playTrack() {
    $rootScope.$broadcast('queue.check', {context: $scope.context, item: $scope.item});
    $rootScope.$broadcast('player.play.track', $scope.item);
  }

  /**
   * Toggle playing the track
   * Broadcast a play or pause which the player
   * will receive and use to play the track
   * @return {void}
   */
  $scope.togglePlayTrack = function togglePlayTrack() {
    if ($scope.isPlaying){
      pauseTrack();
    } else {
      playTrack();
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
    if ($scope.item.id === id) {
      $scope.isPlaying = true;

      if($scope.isMini)
        $scope.isExpanded = true;
    }
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
    if ($scope.item.id === id)
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
      LikesService.unlikeTrack($scope.item.id).then(function(){
        $scope.isLiked = false;
      }, function(){

      });
    } else {
      LikesService.likeTrack($scope.item).then(function(){
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
    if (LikesService.isLiked($scope.item.id)) {
      $scope.isLiked = true;
    }
  }

  /**
   * Repost functions
   */

  /**
   * Toggle the reposting of the track
   * Call the RepostService based on if the track is
   * reposted or not
   * @return {void}
   */
  $scope.toggleTrackRepost = function toggleTrackRepost() {
    if ($scope.isReposted) {
      RepostService.unRepost($scope.item.id).then(function(){
        $scope.isReposted = false;
      }, function(){

      });
    } else {
      RepostService.repost($scope.item).then(function(){
        $scope.isReposted = true;
      }, function(){

      });
    }
  };

  /**
   * Check with the RepostService if the
   * track is reposted by the user. Set the
   * isReposted variable
   */
  function setIfTrackReposted() {
    if (RepostService.isReposted($scope.item.id)) {
      $scope.isReposted = true;
    }
  }

  /**
   * Add the track as next item in the queue
   */
  $scope.addToQueue = function addToQueue() {
    QueueService.addNext($scope.item);
  };

  $scope.toggleExpand = function toggleExpanded() {
    if ($scope.isExpanded && $scope.isPlaying) {
      pauseTrack();
    }
    if (!$scope.isExpanded) {
      playTrack();
    }
    if ($scope.isExpanded && !$scope.isPlaying) {
      $scope.isExpanded = false;
    }
  };

  $rootScope.$on('player.finished.track', function(ev, trackId) {
    if ($scope.item.id === trackId)
      $scope.isExpanded = false;
  });

});
