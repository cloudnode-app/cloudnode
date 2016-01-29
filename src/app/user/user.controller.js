'use strict';

angular.module('cloudnode.user', [
  'ui.router',

  'cloudnode.service.user',
  'cloudnode.service.queue',
  'cloudnode.service.cache',
  'infinite-scroll'
])

.config(function ($stateProvider) {
  $stateProvider.state('user', {
    url: '/user/:userId',
      templateUrl: 'user/user.tmpl.html',
      controller: 'UserCtrl'
  });
})

.controller('UserCtrl', function ($scope, $rootScope, $stateParams, UserService, QueueService){

  $scope.allItems       = {
    collection: [],
    nextHref: ''
  };
  $scope.trackItems     = {
    collection: [],
    nextHref: ''
  };
  $scope.repostItems    = {
    collection: [],
    nextHref: ''
  };
  $scope.spotlightItems = {
    collection: []
  };

  $scope.user       = {};
  $scope.userVisual = '';
  $scope.context    = '';

  var userId = 0;

  $scope.init = function initUser() {
    if (!$stateParams.hasOwnProperty('userId')){

    }
    userId = $stateParams.userId;
    $scope.context = 'user' + userId;

    initUserInfo();
  };

  function initUserInfo() {
    UserService.getUserVisual(userId).then(function (userVisual) {
      if (userVisual.enabled) {
        $scope.userVisual = userVisual.visuals[0].visual_url.replace('original', 't1240x260');
      }
    });

    UserService.getUser(userId).then(function (user) {
      user.avatar_url = user.avatar_url.replace('large', 't200x200');
      $scope.user = user;
    });

    loadActivity();
  }

  $scope.onTabSelect = function onTabSelect(label){
    if (label === 'tracks') {
      loadTracks();
    } else if (label === 'repost') {
      loadReposts();
    } else if (label === 'playlist') {
      loadPlaylists();
    }
  };

  function loadActivity() {
    UserService.getUserSpotlight(userId).then(function (spotlight) {
      //$scope.spotlightItems = spotlight.collection;
      addToScope('spotlightItems', spotlight, true);
    });

    UserService.getUserActivity(userId).then(function (activity) {
      addToScope('allItems', activity);
    });
  }

  function loadTracks() {
    UserService.getUserTracks(userId).then(function (activity) {
      addToScope('trackItems', activity);
    });
  }

  function loadReposts() {
    UserService.getUserReposts(userId).then(function (activity) {
      addToScope('repostItems', activity);
    });
  }

  function loadPlaylists() {

  }

  /**
   * Add an item to the queue
   * Checks if the QueueService has this controllers context
   * @param {object} item The item to add to the queue
   */
  function addToQueue(item) {
    QueueService.addToEnd(item, $scope.context);
  }


  function addToScope(scopeItem, itemObj, ignoreNextHref) {
    if (!ignoreNextHref) {
      $scope[scopeItem].nextHref = itemObj.next_href;
    }

    var queueContext = QueueService.getContext();

    var newItems = itemObj.collection;
    console.log(newItems);
    for (var i = 0; i < newItems.length; i++) {
      var isPlaylist = false;
      if (newItems[i].hasOwnProperty('type') && (newItems[i].type === 'playlist' || newItems[i].type === 'playlist-repost')) {
        isPlaylist = true;
      } else if (newItems[i].hasOwnProperty('tracks')) {
        isPlaylist = true;
      }

      if (!isPlaylist) {
        // Set the uuid on the track object for now
        if (newItems[i].hasOwnProperty('track')) {
          newItems[i].track.uuid = newItems[i].uuid;
        } else {
          newItems[i].uuid = newItems[i].id;
        }

        // Add only the track object to the queue array
        $scope[scopeItem].collection.push(newItems[i]);

        if (queueContext !== $scope.context) {
          if (newItems[i].hasOwnProperty('track')) {
            addToQueue(newItems[i].track);
          } else {
            addToQueue(newItems[i]);
          }
        }
      }
    }
  }

});
