'use strict';

/**
* cloudnode.likes Module
*
* Description
*/
angular.module('cloudnode.likes', [
  'ui.router',

  'cloudnode.service.likes',
  'cloudnode.service.queue',
  'infinite-scroll'
])

.config(function ($stateProvider) {
  $stateProvider.state('likes', {
    url: '/likes',
      templateUrl: 'likes/likes.tmpl.html',
      controller: 'LikesCtrl'
  });
})

.controller('LikesCtrl', function ($scope, LikesService, QueueService) {

  $scope.likes      = [];
  $scope.isLoading  = false;
  $scope.context    = 'likes';

  /**
   * Initialize the Likes page
   * @return {void}
   */
  $scope.initLikes = function initLikes(){
    if (LikesService.isInitialized()) {
      QueueService.onContextChange($scope.context, contextChangedListener);

      filterLikes(LikesService.getAllLikes());
      $scope.isLoading = false;
    } else {
      $scope.isLoading = true;
      LikesService.onInitialized($scope.initLikes());
    }
  };

  $scope.loadNextPage = function loadNextPage() {

  };

  function contextChangedListener() {
    return $scope.likes;
  }

  function addToQueue(item) {
    if (QueueService.canAddToQueue($scope.context)) {
      QueueService.add($scope.context, item);
    }
  }

  function filterLikes(likes) {
    for (var i = 0; i < likes.length; i++) {
      if (likes[i].type !== 'playlist-repost' && likes[i].type !== 'playlist'){
        likes[i].uuid = likes[i].id;
        $scope.likes.push(likes[i]);
        addToQueue($scope.context, likes[i]);
      }
    }
  }

});
