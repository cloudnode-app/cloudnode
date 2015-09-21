'use strict';

/**
 * The Likes service
 */

angular.module('cloudnode.service.likes', [
  'cloudnode.service.api'
])

.factory('LikesService', function (ApiService) {
  var likes = [];
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
      ApiService.getMeLikes().then(function (likesArr){
        likes = likesArr;

        isInitialized = true;
        notifyObservers();
      }, function(){
        console.warn('Unable to retrieve likes');
      });
    },

    getAllLikes: function getAllLikes(){
      return likes;
    },

    isLiked: function isLiked(trackId) {
      return likes.filter(function (like){
        return like.id === trackId;
      }).length > 0;
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
