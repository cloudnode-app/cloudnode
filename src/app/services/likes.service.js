'use strict';

/**
 * The Likes service
 */

angular.module('cloudnode.service.likes', [
  'cloudnode.service.api'
])

.factory('LikesService', function (ApiService) {
  var likes         = [];
  var likesIds      = [];
  var isInitialized = false;

  var observerCallbacks = [];

  function notifyObservers(){
    for (var i = observerCallbacks.length - 1; i >= 0; i--) {
      observerCallbacks[i]();
    }
    observerCallbacks = [];
  }

  function removeTrack(trackId) {
    for (var i = likes.length - 1; i >= 0; i--) {
      if (likes[i].id === trackId)
        delete likes[i];
    }
  }

  return {
    init: function initLikesService(){
      var _this = this;
      ApiService.getMeLikesIds().then(function (likesIdsObj){
        likesIds = likesIdsObj.collection;

        _this.getAllLikesObjs();
        isInitialized = true;
        notifyObservers();
      }, function(){
        console.warn('Unable to retrieve likes');
      });
    },

    getAllLikes: function getAllLikes(){
      return likes;
    },

    getAllLikesObjs: function getAllLikesIds(){
      ApiService.getMeLikes().then(function (likesArr){
        likes = likesArr;
      }, function(){
        console.warn('Unable to retrieve likes');
      });
    },

    isLiked: function isLiked(trackId) {
      return likesIds.indexOf(trackId) !== -1;
    },

    unlikeTrack: function unlikeTrack(trackId) {
      return ApiService.unlikeTrack(trackId).then(function() {
        removeTrack(trackId);
        return true;
      }, function() {
        return false;
      });
    },

    likeTrack: function likeTrack(track) {
      return ApiService.likeTrack(track.id).then(function() {
        likes.push(track);
        return true;
      }, function() {
        return false;
      });
    },

    isInitialized: function isLikeServiceInitialized() {
      return isInitialized;
    },

    onInitialized: function onLikeServiceInitialized(callback) {
      observerCallbacks.push(callback);
    }
  };
});
