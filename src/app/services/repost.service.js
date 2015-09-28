'use strict';

/**
 * The Repost service
 */

angular.module('cloudnode.service.repost', [
  'cloudnode.service.api'
])

.factory('RepostService', function (ApiService) {
  var repostIds     = [];
  var isInitialized = false;

  var observerCallbacks = [];

  function notifyObservers(){
    for (var i = observerCallbacks.length - 1; i >= 0; i--) {
      observerCallbacks[i]();
    }
    observerCallbacks = [];
  }

  function removeTrack(trackId) {
    for (var i = repostIds.length - 1; i >= 0; i--) {
      if (repostIds[i] === trackId)
        delete repostIds[i];
    }
  }

  return {
    init: function initRepostService(){
      ApiService.getMeRepostIds().then(function (repostIdsObj){
        console.log(repostIdsObj);
        repostIds = repostIdsObj.collection;

        isInitialized = true;
        notifyObservers();
      }, function(){
        console.warn('Unable to retrieve reposts');
      });
    },

    isReposted: function isReposted(itemId) {
      return repostIds.indexOf(itemId) !== -1;
    },

    unRepost: function unRepostItem(itemId) {
      return ApiService.unRepostItem(itemId).then(function() {
        removeTrack(itemId);
        return true;
      }, function() {
        return false;
      });
    },

    repost: function repostItem(item) {
      return ApiService.repostItem(item.id).then(function() {
        repostIds.push(item.id);
        return true;
      }, function() {
        return false;
      });
    },

    isInitialized: function isRepostServiceInitialized() {
      return isInitialized;
    },

    onInitialized: function onLikeServiceInitialized(callback) {
      observerCallbacks.push(callback);
    }
  };
});
