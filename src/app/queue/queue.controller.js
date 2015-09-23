'use strict';

angular.module('cloudnode.queue', [
  'cloudnode.service.queue'
])

.config(function ($stateProvider) {
  $stateProvider.state('queue', {
    url: '/',
      templateUrl: 'queue/queue.tmpl.html',
      controller: 'QueueCtrl'
  });
})

.controller('QueueCtrl', function($scope, $rootScope, QueueService){

  $scope.queueItems   = [];
  $scope.historyItems = [];

  $scope.currentTrack = {};

  $scope.initQueue = function initQueue() {
    QueueService.onCurrentItemChange(currentItemChanged);
    $scope.currentTrack = QueueService.getCurrent();

    $scope.queueItems = QueueService.getQueue();
  };

  function currentItemChanged(item) {
    $scope.currentTrack = item;
    $scope.queueItems.splice(0,1);
  }

  $scope.$on('$destroy', function() {
    QueueService.removeCurrentItemChangeListener();
  });

});
