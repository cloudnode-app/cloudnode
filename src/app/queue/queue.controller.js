'use strict';

angular.module('cloudnode.queue', [
  'cloudnode.service.queue',
  'cloudnode.service.likes'
])

.config(function ($stateProvider) {
  $stateProvider.state('queue', {
    url: '/',
      templateUrl: 'queue/queue.tmpl.html',
      controller: 'QueueCtrl'
  });
})

.controller('QueueCtrl', function($scope, $rootScope, QueueService, LikesService){

  $scope.queueItems   = [];
  $scope.historyItems = [];

  $scope.queueLikes = {};

  $scope.currentTrack = {};

  // Liked variables
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

  // Liked variables
  $scope.repostConfig = {
    true: {
      color: '#EF6C00',
      tooltip: 'Remove repost'
    },
    false: {
      color: '#fff',
      tooltip: 'Repost track'
    }
  };

  $scope.initQueue = function initQueue() {
    QueueService.onCurrentItemChange(currentItemChanged);
    $scope.currentTrack = QueueService.getCurrent();

    $scope.queueItems = QueueService.getQueue();

    if (LikesService.isInitialized()) {
      setIfTracksLiked();
    } else {
      LikesService.onInitialized(setIfTracksLiked);
    }
  };

  function setIfTracksLiked() {
    $scope.queueLikes[$scope.currentTrack.id] = LikesService.isLiked($scope.currentTrack.id);

    for (var i = $scope.queueItems.length - 1; i >= 0; i--) {
      $scope.queueLikes[$scope.queueItems[i].id] = LikesService.isLiked($scope.queueItems[i].id);
    }
    console.log($scope.queueLikes);
  }

  $scope.toggleTrackLiked = function toggleTrackLiked(trackId) {
    if ($scope.queueLikes[trackId]) {
      LikesService.unlikeTrack(trackId).then(function(){
        $scope.queueLikes[trackId] = false;
      }, function(){

      });
    } else {
      var track = $scope.queueItems.filter(function(item){
        return item.id === trackId;
      });

      LikesService.likeTrack(track).then(function(){
        $scope.queueLikes[trackId] = true;
      }, function(){

      });
    }
  };

  function currentItemChanged(item) {
    $scope.currentTrack = item;
    $scope.queueItems.splice(0,1);
  }

  $scope.$on('$destroy', function() {
    QueueService.removeCurrentItemChangeListener();
  });

});
