'use strict';

/**
* cloudnode.service.api Module
*
* The CloudNode SoundCloud API service
*/
angular.module('cloudnode.service.api', [
  'cloudnode.api.endpoints'
])

.factory('ApiService', function ($http, $window, $q, END_POINTS) {
var authToken = $window.authToken;

function tokenifyURL(endpoint) {
  console.log(authToken);
  return endpoint + '?oauth_token=' + authToken;
}

return {

  /**
   * Get the user info of the logged in user
   * @return {object} The user or an error
   */
  getMe: function getMe() {
    return $http.get(tokenifyURL(END_POINTS.me)).then(function (response){
      if (angular.isObject(response)) {
        return response.data;
      } else {
        return $q.reject({error: 'InvalidResponse'});
      }
    }, function () {
      return $q.reject({error: 'UnexpectedResponse'});
    });
  },

  getMePlaylists: function getMePlaylists() {
    return $http.get(tokenifyURL(END_POINTS.mePlaylists)).then(function (response) {
      if (angular.isObject(response)) {
        return response.data;
      } else {
        return $q.reject({error: 'InvalidResponse'});
      }
    }, function () {
      return $q.reject({error: 'UnexpectedResponse'});
    });
  }
};
});
