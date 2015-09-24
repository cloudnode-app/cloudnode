'use strict';

/**
* cloudnode.likes Module
*
* The Likes view controller and config
*/
angular.module('cloudnode.likes', [
  'ui.router',

  'cloudnode.service.likes',
  'cloudnode.service.queue',
  'cloudnode.service.cache',
  'infinite-scroll'
])

.config(function ($stateProvider) {
  $stateProvider.state('likes', {
    url: '/likes',
      templateUrl: 'likes/likes.tmpl.html',
      controller: 'LikesCtrl'
  });
})

.controller('LikesCtrl', function ($scope, LikesService, QueueService, CacheService) {

  /**
   * The scope variables
   */
  $scope.likes      = [];
  $scope.isLoading  = false;
  $scope.context    = 'likes';

  var nextHref;

  /**
   * Initialize the Likes page
   * @return {void}
   */
  $scope.initLikes = function initLikes(){
    if (CacheService.isInCache($scope.context)) {
      var cache     = CacheService.getCache($scope.context);

      addToLikes(cache.likes);
      nextHref = cache.nextHref;
    } else {
      if (LikesService.isInitialized()) {
        QueueService.onContextChange($scope.context, contextChangedListener);

        addToLikes(LikesService.getAllLikes());
        $scope.isLoading = false;
      } else {
        $scope.isLoading = true;
        LikesService.onInitialized($scope.initLikes());
      }
    }
  };

  /**
   * TODO: add implementation
   *
   * Load next page for the likes
   * @return {[type]} [description]
   */
  $scope.loadNextPage = function loadNextPage() {

  };

  $scope.$on('$destroy', function(){
    CacheService.addToCache($scope.context, {
      likes: $scope.likes,
      nextHref: nextHref
    });
  });

  /**
   * Gets called when the context of the QueueService
   * changes to this controllers context and will
   * return the liked tracks to the QueueService
   * @return {array} The array of liked tracks
   */
  function contextChangedListener() {
    return $scope.likes;
  }

  /**
   * Add a like item to the queue
   * Checks if the QueueService has this controllers context
   * @param {object} item The liked item to add to the queue
   */
  function addToQueue(item) {
    if (QueueService.canAddToQueue($scope.context)) {
      QueueService.add($scope.context, item);
    }
  }

  /**
   * Add liked items to the likes array
   *
   * At the moment the application doesn't
   * support playlists, so we filter these out
   *
   * @param {array} newItems Array of items to add to the liked array
   */
  function addToLikes(likes) {
    for (var i = 0; i < likes.length; i++) {
      if (likes[i].type !== 'playlist-repost' && likes[i].type !== 'playlist'){
        // Set the track id as uuid for now
        likes[i].uuid = likes[i].id;

        $scope.likes.push(likes[i]);
        addToQueue($scope.context, likes[i]);
      }
    }
  }

});
