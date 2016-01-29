'use strict';

/**
* cloudnode.stream Module
*
* The stream view controller and config
* Contains all the logic for the stream view
*/
angular.module('cloudnode.stream', [
  'ui.router',

  'cloudnode.service.api',
  'cloudnode.service.queue',
  'cloudnode.service.cache',
  'infinite-scroll'
])

.config(function ($stateProvider) {
  $stateProvider.state('stream', {
    url: '/stream',
      templateUrl: 'stream/stream.tmpl.html',
      controller: 'StreamCtrl'
  });
})

.controller('StreamCtrl', function ($scope, ApiService, QueueService, CacheService) {

  /**
   * Private variables
   */
  var nextHref = '';
  var streamTracks = [];
  var trackIds = [];

  /**
   * Scope variables
   */
  $scope.stream     = [];
  $scope.isLoading  = false;
  $scope.context    = 'stream';

  /**
   * Initialize the stream page
   * Sets the QueueService context changed listener
   * Gets the stream from SoundCloud
   * @return {void}
   */
  $scope.initStream = function initStream(){
    QueueService.onContextChange(contextChangedListener);

    if (CacheService.isInCache($scope.context)) {
      var cache     = CacheService.getCache($scope.context);

      addToStream(cache.stream, true);
      nextHref      = cache.nextHref;
      expandCurrentlyPlaying();
    } else {
      ApiService.getStream().then(function(stream){
        nextHref = stream.next_href;

        addToStream(stream.collection, true);
        expandCurrentlyPlaying();
      }, function(){

      });
    }
  };

  /**
   * Load the following page when the user has scrolled to the bottom
   * @return {void}
   */
  $scope.loadNextPage = function loadNextPage() {
    if ($scope.isLoading) {
      return;
    }
    $scope.isLoading = true;

    if (nextHref !== '') {
      ApiService.getStreamNextPage(nextHref).then(function(nextPage) {
        nextHref = nextPage.next_href;

        addToStream(nextPage.collection, false);

        $scope.isLoading = false;
      }, function(){

      });
    }

  };

  $scope.$on('$destroy', function(){
    CacheService.addToCache($scope.context, {
      stream: $scope.stream,
      nextHref: nextHref
    });
  });

  function expandCurrentlyPlaying() {
    var currentTrack = QueueService.getCurrent();
    if (currentTrack !== null) {
       for (var i = 0; i < $scope.stream.length; i++) {
          if ($scope.stream[i].uuid === currentTrack.uuid) {
              console.log('Found currently playing');
             $scope.stream[i].isExpanded = true;
          }
       }
    }
  }

  /**
   * Gets called when the context of the QueueService
   * changes to this controllers context and will
   * return the stream's tracks to the QueueService
   * @return {array} The array of stream tracks
   */
  function contextChangedListener() {
    return streamTracks;
  }

  /**
   * Add a stream item to the queue
   * Checks if the QueueService has this controllers context
   * @param {object} item The stream item to add to the queue
   */
  function addToQueue(item) {
    QueueService.addToEnd(item, $scope.context);
  }

  /**
   * Check if the track is already in the stream
   * if so, prevent it from showing. We don't want
   * the same track to be present so close to the other
   * @param {int} id The id of the track to check
   */
  function trackInStream(id) {
    if (trackIds.length >= 25) {
      trackIds.shift();
    }

    if (trackIds.indexOf(id) === -1) {
        trackIds.push(id);
        return false;
    }
    return true;
  }

  /**
   * Add stream items to the stream array
   *
   * At the moment the application doesn't
   * support playlists, so we filter these out
   *
   * @param {array} newItems Array of items to add to the stream
   */
  function addToStream(newItems, isInit) {
    if (QueueService.canAddToQueue($scope.context)) {
      var queueContext = QueueService.getContext();

      for (var i = 0; i < newItems.length; i++) {
        if (newItems[i].type !== 'playlist-repost' && newItems[i].type !== 'playlist' && !trackInStream(newItems[i].track.id)) {
          $scope.stream.push(newItems[i]);

          // Set the uuid on the track object for now
          newItems[i].track.uuid = newItems[i].uuid;

          // Add only the track object to the queue array
          streamTracks.push(newItems[i].track);

          if ((isInit && queueContext !== $scope.context) || !isInit) {
            addToQueue(newItems[i].track);
          }
        }
      }
    }
  }

});
