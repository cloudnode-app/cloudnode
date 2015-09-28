'use strict';

/**
* cloudnode Module
*
* Description
*/
angular.module('cloudnode', [
  'ui.router',
  'ngMaterial',
  'ngMdIcons',
  'ngResource',
  'ngAnimate',
  'templates-app',

  'cloudnode.sidebar',
  'cloudnode.stream',
  'cloudnode.likes',
  'cloudnode.queue',
  'cloudnode.service.api',
  'cloudnode.service.likes',
  'cloudnode.service.repost',
  'cloudnode.directive.player',
  'cloudnode.directive.trackcard'
])

.config(function ($urlRouterProvider, $locationProvider, $mdThemingProvider) {
  // Send unmatched routes to root
  $urlRouterProvider.otherwise('/');

  $locationProvider.hashPrefix('!');

  $mdThemingProvider.theme('default')
      .primaryPalette('orange', {
        'default': '800'
      })
      .dark();
})

.controller('AppCtrl', function ($scope, ApiService, LikesService, RepostService) {
  $scope.appLoaded  = false;
  $scope.meUser     = null;
  $scope.meLikes    = null;

  $scope.initCloudNode = function () {
    ApiService.getMe().then(function(me) {
      $scope.meUser    = me;

      initLikesService();
      initRepostService();

      $scope.appLoaded = true;
    }, function(err){
      console.warn(err);
    });
  };

  function initLikesService() {
    LikesService.init();
  }

  function initRepostService() {
    RepostService.init();
  }

});

angular.element(document).ready(function() {
    //Fixing facebook bug with redirect
    if (window.location.hash === '#_=_') window.location.hash = '#!';
});
