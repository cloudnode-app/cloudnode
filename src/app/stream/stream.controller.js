'use strict';

/**
* cloudnode.stream Module
*
* Description
*/
angular.module('cloudnode.stream', [
  'ui.router',

  'cloudnode.service.api',
  'cloudnode.service.queue',
  'infinite-scroll'
])

.config(function ($stateProvider) {
  $stateProvider.state('stream', {
    url: '/',
      templateUrl: 'stream/stream.tmpl.html',
      controller: 'StreamCtrl'
  });
})

.controller('StreamCtrl', function ($scope, ApiService, QueueService) {

  $scope.stream     = [];
  $scope.isLoading  = false;
  $scope.context    = 'stream';

  var nextHref = '';
  var streamTracks = [];

  /**
   * Initialize the stream page
   * @return {void}
   */
  $scope.initStream = function initStream(){
    QueueService.onContextChange($scope.context, contextChangedListener);

    ApiService.getStream().then(function(stream){
      nextHref = stream.next_href;

      addToStream(stream.collection);
    }, function(){

    });
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

        addToStream(nextPage.collection);

        $scope.isLoading = false;
      }, function(){

      });
    }

  };

  function contextChangedListener() {
    return streamTracks;
  }

  function addToQueue(item) {
    if (QueueService.canAddToQueue($scope.context)) {
      QueueService.add($scope.context, item);
    }
  }

  function addToStream(newItems) {
    for (var i = 0; i < newItems.length; i++) {
      if (newItems[i].type !== 'playlist-repost' && newItems[i].type !== 'playlist') {
        $scope.stream.push(newItems[i]);

        newItems[i].track.uuid = newItems[i].uuid;
        streamTracks.push(newItems[i].track);
        addToQueue($scope.context, newItems[i].track);
      }
    }
  }

});
