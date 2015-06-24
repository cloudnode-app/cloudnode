'use strict';

/**
* cloudnode.stream Module
*
* Description
*/
angular.module('cloudnode.stream', [
  'ui.router',

  'cloudnode.service.api'
])

.config(function ($stateProvider) {
  $stateProvider.state('stream', {
    url: '/',
    views: {
      templateUrl: 'stream/stream.tmpl.html',
      controller: 'StreamCtrl'
    }
  });
})

.controller('StreamCtrl', function () {

});
