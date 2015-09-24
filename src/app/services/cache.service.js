'use strict';

/**
* cloudnode.service.api Module
*
* The CloudNode SoundCloud API service
*/
angular.module('cloudnode.service.cache', [
])

.factory('CacheService', function () {

  var cache = {};

return {

  addToCache: function addToCache(context, items) {
    cache[context] = items;
  },

  getCache: function getCache(context) {
    return cache[context];
  },

  isInCache: function isInCache(context) {
    return Object.prototype.hasOwnProperty.call(cache, context);
  }

};
});
