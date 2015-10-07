'use strict';

/**
* cloudnode.directe.player Module
*
* Description
*/
angular.module('cloudnode.directive.player', [
  'angularSoundManager',
  'cloudnode.service.api',
  'cloudnode.service.queue',
  'cloudnode.service.history'
])

.controller('PlayerCtrl', function ($rootScope, $scope, angularPlayer, QueueService, HistoryService, ApiService, $filter) {
  /**
   * Default track settings
   */
  function resetPlayerValues() {
    $scope.currentPosition = '0:00';
    $scope.currentDuration = '0:00';
    $scope.currentDurationSlider = 0;
    $scope.currentPlaying = {
      artist: '',
      title: '',
      id: 0
    };
    $scope.currentProgress = 0;
  }
  resetPlayerValues();

  /**
   * Volume variables
   */
  $scope.volumeIcon = 'volume_up';
  $scope.volume = 100;
  var unmuteVolume = 100;

  $scope.isPlaying = false;
  $scope.playerIcon = 'play_circle_outline';

  /**
   * Slider variables
   */
  var isDragging      = false;
  var sliderElement   = angular.element('.progress-slider');
  var trackContainer  = angular.element(angular.element('md-slider')[0].querySelector('.md-track-container'));

  /**
   * Current track id
   */
  var currentTrackId = 0;

  /**
   * Toggle the mute of the track
   * @return {void}
   */
  $scope.toggleMuted = function () {
    if (angularPlayer.isMuted()) {
      $scope.volume = unmuteVolume; // Set previous volume value

      $scope.volumeIcon = 'volume_up';
      angularPlayer.toggleMute();
    } else {
      unmuteVolume = angularPlayer.getVolume(); // save current value to set back on un-mute
      $scope.volume = 0;

      $scope.volumeIcon = 'volume_off';
      angularPlayer.toggleMute();
    }
  };

  /**
   * Listen for the volume model to change
   * volume model is bound to the volume slider
   * @return {void}
   */
  $scope.$watch('volume', function() {
    angularPlayer.setVolume($scope.volume);
  });

  /**
   * Toggles the play button and
   * the track that is currently playing
   * @return {void}
   */
  $scope.togglePlaying = function() {
    if (angularPlayer.isPlayingStatus()) {
      pauseCurrentTrack();
    } else {
      playCurrentTrack();
    }
  };

  /**
   * Play the current track
   * The broadcast is handled by 'track:id'
   * @return {void}
   */
  function playCurrentTrack() {
    $scope.playerIcon = 'pause_circle_outline';
    angularPlayer.play();
  }

  /**
   * Pause the current track
   * Broadcast that the track is paused
   * @return {void}
   */
  function pauseCurrentTrack() {
    $scope.playerIcon = 'play_circle_outline';
    angularPlayer.pause();
    $rootScope.$broadcast('track.setPause', currentTrackId);
  }

  /**
   * If the current track changes from the player
   * set the icon of a track card to the play icon
   * through a broadcast
   * @return {void}
   */
  function resetCurrentTrackPlayIcon() {
    if (currentTrackId !== 0) {
      $rootScope.$broadcast('track.setPause', currentTrackId);
    }
  }

  /**
   * Get the previous track in the Queue
   * If no previous track reset the player values
   * @return {void}
   */
  $scope.previousTrack = function previousTrack() {
    addToHistory();

    var track = null;
    if ($scope.currentProgress < 20000) {
      track = QueueService.getPrevious();
    } else {
      track = QueueService.getCurrent();
    }

    resetCurrentTrackPlayIcon();
    if (track !== null)
      playTrack(track);
    else
      resetPlayerValues();
  };

  /**
   * Get the next track in the Queue
   * If no next track reset the player values
   * @return {void}
   */
  $scope.nextTrack = function nextTrack() {
    addToHistory();

    var track = QueueService.getNext();
    resetCurrentTrackPlayIcon();
    if (track !== null)
      playTrack(track);
    else
      resetPlayerValues();
  };

  $rootScope.$on('player.play.track', playEventTrack);
  $rootScope.$on('player.pause.track', pauseCurrentTrack);
  $rootScope.$on('track:finished', $scope.nextTrack);

  function addToHistory() {
    if ($scope.currentProgress > 20000) {
      HistoryService.addTrack(QueueService.getCurrent());
    }
  }

  /**
   * Play a track object
   * Set the current track and create
   * an AngularPlayer track object
   * @param  {object} track The track to play
   * @return {void}
   */
  function playTrack(track) {
    var trackId = 'track' + track.id;
    angularPlayer.addTrack({
            id: trackId,
            artist: track.artist,
            title: track.title,
            url: ApiService.getStreamableUrl(track.stream_url)
        });

    currentTrackId = track.id;
    angularPlayer.playTrack(trackId);
    $scope.playerIcon = 'pause_circle_outline';
  }

  /**
   * Handle the play track event
   * If it is the current track then resume playing
   * @param  {event}  event The event object
   * @param  {object} track The track object
   * @return {void}
   */
  function playEventTrack(event, track) {
    if (track.id === currentTrackId)
      playCurrentTrack();
    else
      playTrack(track);
  }

  /**
   * Handle AngularPlayer broadcast for track play
   * @param  {function} Broadcast that the track is playing
   * @return {void}
   */
  $rootScope.$on('track:id', function(){
    $rootScope.$broadcast('track.setPlaying', currentTrackId);
  });

  /********************************
   * Progress Slider
   *******************************/

   /**
    * When receiving a new position update the slider to
    * that given position. But only when the user isn't dragging
    * the slider
    * @param  {event}   event The Scope event
    * @param  {object}  data  The data of the event
    * @return {void}
    */
   $scope.$on('currentTrack:position', function (event, data) { /* jshint ignore:line */
    if (!isDragging) {
      $scope.$apply(function() {
        $scope.currentProgress = data;
      });
    }
  });

  /**
   * The listener for the drag start event
   * Used to set the isDragging variable
   * @return {void}
   */
  sliderElement.on('$md.dragstart', function() {
    isDragging = true;
  });

  /**
   * The listener for the dragging event
   * Used to update the current position label
   * @return {void}
   */
  sliderElement.on('$md.drag', function(ev) {
    var sliderDimensions = trackContainer[0].getBoundingClientRect();
    $scope.currentPostion = $filter('humanTime')(percentToValue(positionToPercent(ev.pointer.x, sliderDimensions)));
  });

  /**
   * The listener for the drag end event
   * Used to set the current track position
   * @return {void}
   */
  sliderElement.on('$md.dragend', function(ev) {
    isDragging = false;

    var sliderDimensions = trackContainer[0].getBoundingClientRect();
    var toPosition = percentToValue(positionToPercent(ev.pointer.x, sliderDimensions));

    angularPlayer.seekCurrentTrack(toPosition);
  });

  /***********************
   * Utility functions
   **********************/

  /**
   * Converts a x position to a percentage for the slider
   * @param  {int} x                    The x position of the slider
   * @param  {Object} sliderDimensions  The dimensions of the element
   * @return {int}                      The position as percentage of the slider
   */
  function positionToPercent( x, sliderDimensions ) {
    return Math.max(0, Math.min(1, (x - sliderDimensions.left) / (sliderDimensions.width)));
  }

  /**
   * Convert percentage offset on slide to equivalent model value
   * @param percent
   * @returns {*}
   */
  function percentToValue( percent ) {
    return (0 + percent * ($scope.currentDurationSlider - 0));
  }
});
